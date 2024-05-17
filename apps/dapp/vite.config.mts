/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron';
  const isProduction = mode === 'production';

  const _isProduction = isElectron || isProduction

  return {
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
            baseHref: isElectron ? './' : '/'
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
      reportCompressedSize: true,
      sourcemap: true,
      terserOptions: {
        format: {
          comments: false
        },
        compress: _isProduction,
      }
    },
    esbuild: {
      legalComments: 'none'
    },
  }
});
