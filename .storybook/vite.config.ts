import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Storybook's manager and docs bundles are large by nature; this is not shipped to users.
    chunkSizeWarningLimit: 2000,
  },
});
