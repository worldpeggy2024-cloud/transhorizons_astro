import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import yaml from '@rollup/plugin-yaml';

/** Sends a full-page reload to the browser whenever a YAML content file changes. */
function yamlHmrPlugin() {
  return {
    name: 'yaml-hmr',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  integrations: [react(), keystatic()],
  vite: {
    optimizeDeps: {
      exclude: [
        '@keystatic/astro/internal/keystatic-api.js',
        '@keystatic/astro/internal/keystatic-astro-page.astro',
      ],
    },
    plugins: [tailwindcss(), yaml(), yamlHmrPlugin()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
  output: 'server',
});
