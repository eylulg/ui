import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { components } from './scripts/components.ts';

const root = import.meta.dirname;

const entries = Object.fromEntries([
  ['index', resolve(root, 'src/index.ts')],
  ['utils/cx', resolve(root, 'src/utils/cx.ts')],
  ['utils/cxLite', resolve(root, 'src/utils/cxLite.ts')],
  ['styles/themes/variants', resolve(root, 'src/styles/themes/variants.ts')],
  ['chrome/index', resolve(root, 'src/chrome/index.ts')],
  ['chrome/projects', resolve(root, 'src/chrome/projects.ts')],
  ['chrome/themeScript', resolve(root, 'src/chrome/themeScript.ts')],
  ...components.map((name) => [
    `components/${name}/index`,
    resolve(root, `src/components/${name}/index.ts`),
  ]),
]);

/**
 * Modules that are safe to import from React Server Components. Everything
 * else gets a "use client" banner so Next.js treats it as a client module.
 * Plain data and string exports (variants, projects, themeInitScript) must stay
 * server safe, or a server component would receive a client reference instead
 * of the value.
 */
const serverSafe = [
  /^utils\//,
  /^styles\//,
  /^chrome\/(index|projects|themeScript|AppShell|SiteFooter|BrandMark)\.js$/,
];

const external = [
  /^react($|\/)/,
  /^react-dom($|\/)/,
  /^react-aria-components($|\/)/,
  /^tailwind-merge($|\/)/,
  /^lucide-react($|\/)/,
  /^@internationalized\/date($|\/)/,
];

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rolldownOptions: {
      external,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        banner: (chunk) =>
          serverSafe.some((pattern) => pattern.test(chunk.fileName)) ? '' : '"use client";',
      },
    },
  },
});
