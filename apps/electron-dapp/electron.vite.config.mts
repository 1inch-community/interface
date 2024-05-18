import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { dirname, join } from 'path'


export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    base: './',
    root: join(dirname(dirname(__dirname)), 'dist', 'apps', 'dapp'),
    build: {
      rollupOptions: {
        input: join(dirname(dirname(__dirname)), 'dist', 'apps', 'dapp', 'index.html'),
      }
    }
  }
})
