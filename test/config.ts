import { addImports, createResolver } from '@nuxt/kit'
import type { NuxtConfig } from 'nuxt/schema'

export const enableGlobalMiddleware = {
  hanko: { globalMiddleware: true },
} satisfies NuxtConfig

const resolver = createResolver(import.meta.url)

export const mockLoggedIn = {
  hooks: {
    ready: () => {
      addImports({
        name: 'useHanko',
        as: 'useHanko',
        from: resolver.resolve('./mocks/useHanko.ts'),
      })
      addImports({
        name: 'useRequestEvent',
        as: 'useRequestEvent',
        from: resolver.resolve('./mocks/useRequestEvent.ts'),
      })
    },
  },
} satisfies NuxtConfig
