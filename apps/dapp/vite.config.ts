/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/dapp',

  optimizeDeps: {
    include: ['tslib']
  },

  define: {
    global: {},
  },

  server: {
    port: 4200,
    host: '0.0.0.0',
  },

  preview: {
    port: 4300,
    host: '0.0.0.0',
  },

  plugins: [
    nxViteTsPaths(),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: process.env['OUT_DIR'] ?? '../../dist/apps/dapp',
    reportCompressedSize: true,
    sourcemap: true,
    terserOptions: {
      format: {
        comments: false
      },
      compress: true,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: { legalComments: 'none' },
});
