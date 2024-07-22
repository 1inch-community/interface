import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { createHtmlPlugin } from 'vite-plugin-html';
import minifyHTML from 'rollup-plugin-minify-html-literals'
import { defaultShouldMinify } from 'minify-html-literals'
import basicSsl from '@vitejs/plugin-basic-ssl'
import preload from "vite-plugin-preload"
import { VitePWA } from 'vite-plugin-pwa';
import { manifest } from './manifest.mjs';

function isCSS(text: string): boolean {
  return (
    text.includes(':host')
    || text.includes(':root')
    || text.includes('@keyframes')
    || text.includes('@media')
    || text.includes('@font-face')
    || text.includes('var(--')
  );
}

function isHTML(text: string): boolean {
  return (
    text.includes('<inch')
    || text.includes('<div')
    || text.includes('<span')
    || text.includes('<button')
    || text.includes('<svg')
  );
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
      // basicSsl({
      //   certDir: './dev-cert',
      //   name: 'one-inch-community-dev',
      //   domains: [
      //     'localhost',
      //     '1inch.local'
      //   ]
      // }),
      preload({
        mode: 'prefetch'
      }),
      isProduction ? (minifyHTML as any).default({ options: { shouldMinify } }) : null,
      createHtmlPlugin({
        inject: {
          data: {
            baseHref: baseHref ?? '/'
          },
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: manifest(baseHref),
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin !== self.location.origin && /\.(png|jpg|jpeg|svg|gif)$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'external-images',
                expiration: {
                  maxEntries: 1500,
                  maxAgeSeconds: 60 * 60 * 24 * 90 // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: ({ url }) => url.origin === self.location.origin && /\.(woff2)$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'fonts',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 360 // 360 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /.*\.svg-.*\.js(\?.*)?$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'js-svg-templates',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^(?!.*\.svg-.*\.js$).*\.js(\?.*)?$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'js-bundles',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ]
        },
        devOptions: {
          enabled: !isProduction
        }
      })
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
