import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'

function generateAlias(path = '') {
  return resolve(resolve(__dirname), './src' + path)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.includes('-')
        },
      }
    }),
    alias(),
  ],
  server: {
    hmr: {
      host: 'https://aiwprtonshop.site/support',
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: generateAlias() },
      { find: '@comps', replacement: generateAlias('/components') },
      { find: '@pages', replacement: generateAlias('/components/pages') },
      { find: '@temps', replacement: generateAlias('/components/templates') },
      { find: '@utils', replacement: generateAlias('/utils') },
    ],
  },
  optimizeDeps: {
    include: ['node_modules']
  },
  base: './',
})
