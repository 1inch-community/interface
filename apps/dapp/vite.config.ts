/// <reference types='vitest' />
import { defineConfig } from 'vite';

import basicSsl from '@vitejs/plugin-basic-ssl'

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../temp/cache/dapp',

  server: {
    port: 4200,
    host: '0.0.0.0',
    https: true,
  },

  preview: {
    port: 4300,
    host: '0.0.0.0'
  },

  plugins: [
    nxViteTsPaths(),
    basicSsl()
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
      compress: true,
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: { legalComments: 'none' },
});
