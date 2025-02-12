import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist', '.venv', 'eslint.config.ts', 'coverage', 'vitest.config.ts', '**/*.d.ts'] },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json', './tsconfig.test.json'],
        // @ts-expect-error languageOptions.tsconfigRootDir
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/dot-notation': 'off',
      'no-prototype-builtins': 'off',
      'react-hooks/exhaustive-deps': 'off',
      quotes: ['error', 'single'],
      'no-unused-vars': 'off', //use tse/no-unused-vars instead.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_$' }],
      '@typescript-eslint/no-explicit-any': 'off', // taken care of by biome. don't know how to specify next-line ignoring on both biome / eslint though.
      '@typescript-eslint/no-unsafe-argument': 'off', // taken care of by biome. don't know how to specify next-line ignoring on both biome / eslint though.
    },
  },
  {
    files: ['tests/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'index-signature'],
      '@typescript-eslint/dot-notation': 'off',
      'no-prototype-builtins': 'off',
      'react-hooks/exhaustive-deps': 'off',
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
)
