import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#imports': fileURLToPath(new URL('./test/mocks/imports.ts', import.meta.url)),
    },
  },
  test: {
    exclude: ['**/test.*', ...configDefaults.exclude],
    coverage: {
      include: ['src/**'],
    },
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
