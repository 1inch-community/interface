/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { createHtmlPlugin } from 'vite-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals'
import { defaultShouldMinify } from 'minify-html-literals'

function isCSS(text: string): boolean {
  return (text.includes(':host') || text.includes(':root') || text.includes('@keyframes') || text.includes('@media') || text.includes('@font-face') || text.includes('var(--'));
}

function isHTML(text: string): boolean {
  return (text.includes('<inch') || text.includes('<div') || text.includes('<span') || text.includes('<button') || text.includes('<svg'));
}

function shouldMinify(template: any) {
  return (
    defaultShouldMinify(template) ||
    template.parts.some((part: { text: string }) => {
      return (
        isCSS(part.text) ||
        isHTML(part.text)
      );
    })
  );
}

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
      isProduction ? (minifyHTML as any).default({ options: { shouldMinify } }) : null,
      createHtmlPlugin({
        inject: {
          data: {
            baseHref: baseHref ?? '/'
          },
        },
      }),
    ].filter(Boolean),

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
    },
    esbuild: { legalComments: 'none' },
  }
});
