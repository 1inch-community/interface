/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const isProduction  = process.env['DAPP_IS_PRODUCTION'] ? Boolean(process.env['DAPP_IS_PRODUCTION']) : mode === 'production';
  const baseHref = process.env['BASE_HREF']
  const baseVite = process.env['BASE_VITE']


  return {
    base: baseVite,
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
      createHtmlPlugin({
        inject: {
          data: {
            baseHref: baseHref ?? '/'
          },
        },
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    build: {
      outDir: '../../dist/apps/dapp',
      chunkSizeWarningLimit: 600,
      reportCompressedSize: true,
      sourcemap: true,
      terserOptions: {
        format: {
          comments: false
        },
        compress: isProduction,
      }
    }
  }
});
