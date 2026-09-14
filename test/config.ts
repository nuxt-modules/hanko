import { addImports, createResolver } from '@nuxt/kit'
import type { NuxtConfig } from 'nuxt/schema'

const resolver = createResolver(import.meta.url)

/** Stubs a logged in session for browser tests, which cannot present a signed token. */
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
