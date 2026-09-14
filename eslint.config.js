// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
      './playground-nuxt5',
    ],
  },
}).append({
  rules: {
    '@typescript-eslint/ban-types': 'off',
  },
})
