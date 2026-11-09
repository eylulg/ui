import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { components } from './scripts/components.ts';

const root = import.meta.dirname;

const entries = Object.fromEntries([
  ['index', resolve(root, 'src/index.ts')],
  ['utils/cx', resolve(root, 'src/utils/cx.ts')],
  ...components.map((name) => [
    `components/${name}/index`,
    resolve(root, `src/components/${name}/index.ts`),
  ]),
]);

const external = [
  /^react($|\/)/,
  /^react-dom($|\/)/,
  /^react-aria-components($|\/)/,
  /^tailwind-merge($|\/)/,
  /^lucide-react($|\/)/,
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
        banner: (chunk) => (chunk.fileName.startsWith('utils/') ? '' : '"use client";'),
      },
    },
  },
});
