/**
 * Keyboard focus ring check in real Chromium. Run after `npm run build-storybook`:
 *
 *   npm run check:focus
 *
 * Tabs to a Button in the built Storybook and asserts the resolved outline is
 * solid and 2px wide. jsdom cannot see this: Tailwind 4's `outline-none` sets
 * `--tw-outline-style: none`, and a ring that only sets the width stays invisible.
 * CI needs the browser once: `npx playwright install --with-deps chromium`.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../storybook-static');
if (!existsSync(join(root, 'iframe.html'))) {
  console.error('storybook-static is missing. Run `npm run build-storybook` first.');
  process.exit(1);
}

const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  const path = join(root, decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/'));
  if (!path.startsWith(root) || !existsSync(path) || !statSync(path).isFile()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
  createReadStream(path).pipe(res);
});
await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
const address = server.address();
const port = typeof address === 'object' && address ? address.port : 0;

const browser = await chromium.launch();
let failed = false;
try {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage();
    await page.goto(
      `http://127.0.0.1:${port}/iframe.html?id=components-button--primary&viewMode=story&globals=theme:${theme}`,
    );
    await page.getByRole('button').first().waitFor();
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement as Element);
      return { style: style.outlineStyle, width: style.outlineWidth };
    });
    const ok = ring.style === 'solid' && ring.width === '2px';
    console.log(`${ok ? 'ok  ' : 'FAIL'} focus ring (${theme}): ${ring.style} ${ring.width}`);
    failed ||= !ok;
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
process.exit(failed ? 1 : 0);
