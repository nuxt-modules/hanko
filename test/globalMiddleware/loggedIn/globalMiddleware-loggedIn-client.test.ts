import { $fetch, fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware, mockLoggedIn } from '../../config'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn, enableGlobalMiddleware),
})

describe('Global middleware, logged in, client-side', async () => {
  it.todo('none')
  it.todo('loggedIn')
  it.todo('loggedOut')
  it.todo('allow:all')
  it.todo('allow:logged-in')
  it.todo('allow:logged-out')
  it.todo('deny:logged-in')
  it.todo('deny:logged-out')
})
