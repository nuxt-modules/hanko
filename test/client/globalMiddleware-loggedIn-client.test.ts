import { $fetch, fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware, mockLoggedIn } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn, enableGlobalMiddleware),
})

describe('Global middleware, logged in, client-side', async () => {
  it('renders page with no middleware')

  it('renders page with hanko-logged-in middleware')

  it('redirects to home page for hanko-logged-out middleware')

  it('allow:logged-in renders page')

  it('allow:logged-in renders page')

  it('allow:logged-out redirects to home page')

  it('deny:logged-in redirects to home page')

  it('deny:logged-out renders page')
})
