import { resolve } from 'node:path'
import { addImports } from '@nuxt/kit'
import type { NuxtConfig } from 'nuxt/schema'

export const enableGlobalMiddleware = {
  hanko: { globalMiddleware: true },
} satisfies NuxtConfig

export const mockLoggedIn = {
  hooks: {
    ready: () => {
      addImports({
        name: 'useHanko',
        as: 'useHanko',
        from: resolve(__dirname, 'mocks/useHanko.ts'),
      })
      addImports({
        name: 'useRequestEvent',
        as: 'useRequestEvent',
        from: resolve(__dirname, 'mocks/useRequestEvent.ts'),
      })
    },
  },
} satisfies NuxtConfig
