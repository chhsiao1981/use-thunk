import { codecovVitePlugin } from '@codecov/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'react-reducer-utils',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  build: {
    lib: {
      entry: ['src/index.ts'],
      name: 'react-reducer-utils.js',
    },
  },
})
