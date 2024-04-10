import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/test.*', ...configDefaults.exclude],
  },
})
