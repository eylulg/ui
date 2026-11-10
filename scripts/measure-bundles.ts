/**
 * Bundles the built package the way a consumer's bundler would (Rolldown, the bundler behind Vite, ESM,
 * minified, code splitting on, react and react-dom external) and prints gzip
 * sizes: the first load (the entry chunk plus everything it imports
 * statically) and the total including lazy chunks. Run `npm run build` first.
 *
 *   npm run measure
 */
import { gzipSync } from 'node:zlib';
import { rolldown } from 'rolldown';
import pkg from '../package.json' with { type: 'json' };

const root = new URL('..', import.meta.url).pathname;

const landing = (withSelect: boolean) => `
import { AppShell, SiteFooter, TopNav, ProjectSwitcher, ThemeToggle } from '@eylulg/ui/chrome';
import { Button } from '@eylulg/ui/button';
import { Input } from '@eylulg/ui/input';
import { Card } from '@eylulg/ui/card';
import { Switch } from '@eylulg/ui/switch';
${withSelect ? "import { Select, SelectItem } from '@eylulg/ui/select';" : ''}
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';

function Landing() {
  return h(AppShell, {
    header: h(TopNav, { productName: 'App', actions: h('div', null, h(ProjectSwitcher, { currentId: 'portfolio' }), h(ThemeToggle)) }),
    footer: h(SiteFooter, { currentId: 'portfolio' }),
  }, h('div', null,
    h(Button, null, 'Start'),
    h(Input, { label: 'Email' }),
    h(Card, null, 'Card'),
    h(Switch, null, 'Notify'),
    ${withSelect ? "h(Select, { label: 'Role' }, h(SelectItem, { id: 'a' }, 'A'))" : 'null'},
  ));
}
createRoot(document.body).render(h(Landing));
`;

const subpaths = Object.keys(pkg.exports)
  .filter((key) => key !== './package.json' && !key.endsWith('.css') && !key.includes('*'))
  .map((key) => key.replace(/^\./, ''));

interface Measure {
  first: number;
  total: number;
}

const gzip = (text: Uint8Array) => gzipSync(text, { level: 9 }).length;

async function measure(contents: string): Promise<Measure> {
  const entryId = '\0measure-entry';
  const aliases = Object.fromEntries(
    Object.entries(pkg.exports)
      .filter(([, value]) => typeof value === 'object')
      .map(([key, value]) => [
        `@eylulg/ui${key.replace(/^\./, '')}`,
        `${root}${(value as { import: string }).import.replace(/^\.\//, '')}`,
      ]),
  );
  const bundle = await rolldown({
    input: entryId,
    external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    platform: 'browser',
    transform: { define: { 'process.env.NODE_ENV': '"production"' } },
    resolve: { alias: aliases },
    plugins: [
      {
        name: 'entry',
        resolveId: (id) => (id === entryId ? id : null),
        load: (id) => (id === entryId ? { code: contents, moduleType: 'tsx' } : null),
      },
    ],
    cwd: root,
    logLevel: 'silent',
  });
  const { output } = await bundle.generate({ format: 'esm', minify: true });
  const chunks = new Map(
    output.flatMap((item) => (item.type === 'chunk' ? [[item.fileName, item] as const] : [])),
  );
  const initial = new Set<string>();
  const queue = [...chunks.values()]
    .filter((chunk) => chunk.isEntry)
    .map((chunk) => chunk.fileName);
  for (const name of queue) {
    if (initial.has(name)) continue;
    initial.add(name);
    queue.push(...(chunks.get(name)?.imports ?? []).filter((file) => chunks.has(file)));
  }
  let first = 0;
  let total = 0;
  for (const [name, chunk] of chunks) {
    const size = gzip(Buffer.from(chunk.code));
    total += size;
    if (initial.has(name)) first += size;
  }
  return { first, total };
}

const kb = (bytes: number) => (bytes / 1000).toFixed(2);
const rows: [string, Measure][] = [];

rows.push([
  'Consumer landing (TopNav, ProjectSwitcher, ThemeToggle, SiteFooter, Button, Input, Card, Switch, Select)',
  await measure(landing(true)),
]);
rows.push(['Same landing without Select', await measure(landing(false))]);
rows.push([
  'tailwind-merge alone',
  await measure("import { twMerge } from 'tailwind-merge'; console.log(twMerge('a','b'))"),
]);
rows.push([
  'react-aria-components Button alone',
  await measure("import { Button } from 'react-aria-components'; console.log(Button)"),
]);
for (const subpath of subpaths) {
  rows.push([
    `@eylulg/ui${subpath}`,
    await measure(`import * as m from '@eylulg/ui${subpath}'; console.log(m);`),
  ]);
}
rows.push([
  '{ Button } from index',
  await measure("import { Button } from '@eylulg/ui'; console.log(Button);"),
]);

console.log('| Bundle | First load gzip kB | Total gzip kB |\n| --- | ---: | ---: |');
for (const [name, { first, total }] of rows)
  console.log(`| ${name} | ${kb(first)} | ${kb(total)} |`);
