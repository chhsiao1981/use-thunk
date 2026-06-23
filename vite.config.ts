import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset({ target: '18' })] })],
  build: {
    lib: {
      entry: ['src/index.ts'],
      name: '@chhsiao1981/use-thunk',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-compiler-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'react-compiler-runtime': 'ReactCompilerRuntime',
        },
      },
    },
  },
})
