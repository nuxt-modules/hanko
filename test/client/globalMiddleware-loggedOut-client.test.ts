import { fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(enableGlobalMiddleware),
})

describe('Global middleware, not logged in, client-side', async () => {
  it('redirects to login for page without explicit middleware')

  it('hanko-logged-in middleware redirects to the login page')

  it('hanko-logged-out middleware renders page')

  it('allow:all renders page')

  it('allow:logged-in redirects to login')

  it('allow:logged-out renders page')

  it('deny:logged-in renders page')

  it('deny:logged-out redirects to login')

  it('applies middleware over pageMeta', async () => {})
})
