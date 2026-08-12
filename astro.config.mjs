import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import yaml from '@rollup/plugin-yaml';
import node from '@astrojs/node';

/**
 * Full-page reload when RENDERED content YAML changes (content/countries/,
 * content/pages/) — @rollup/plugin-yaml imports don't HMR cleanly. Scoped so
 * job records and doc-folder YAML no longer trigger anything, and sent as a
 * custom event so the /keystatic admin can ignore it (see yamlHmrClient):
 * the admin UI is never force-reloaded, neither by installs nor by its own
 * saves — Peggy can edit in Keystatic while the pipeline writes YAML.
 */
function yamlHmrPlugin() {
  return {
    name: 'yaml-hmr',
    handleHotUpdate({ file, server }) {
      if (!/\.ya?ml$/.test(file)) return;
      if (/[\\/]content[\\/](countries|pages)[\\/]/.test(file)) {
        server.ws.send({ type: 'custom', event: 'yaml-reload' });
      }
      return [];
    },
  };
}

/** Dev-only listener for yaml-reload: reloads every page EXCEPT /keystatic. */
function yamlHmrClient() {
  return {
    name: 'yaml-hmr-client',
    hooks: {
      'astro:config:setup': ({ injectScript, command }) => {
        if (command !== 'dev') return;
        injectScript(
          'page',
          `if (import.meta.hot) { import.meta.hot.on('yaml-reload', () => { if (!location.pathname.startsWith('/keystatic')) location.reload(); }); }`
        );
      },
    },
  };
}

export default defineConfig({
  // Canonical origin (single source of truth) for the sitemap, the per-page
  // <link rel="canonical"> in Base.astro, and any absolute URLs — read via
  // Astro.site, never hardcoded. Set to the public domain transhorizons.net so
  // search signals consolidate there. fly.dev still SERVES the same app for
  // verification (no redirect); the 301 from the Fly host to .net is deferred
  // until public launch — see deployment notes in CLAUDE.md.
  site: 'https://transhorizons.net',
  adapter: node({ mode: 'standalone' }),
  
  integrations: [react(), keystatic(), yamlHmrClient()],
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
});
