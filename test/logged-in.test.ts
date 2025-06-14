import { addImports } from '@nuxt/kit'
import { fetch, setup } from '@nuxt/test-utils'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: {
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
  },
})

describe('ssr', async () => {
  it('redirects to the login page', async () => {
    const res = await fetch('/protected')
    expect(res.redirected).toBeFalsy()
    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })
})
