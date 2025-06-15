import { fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { mockLoggedIn } from '../../config'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn),
})

describe('No global middleware, logged in, client-side', async () => {
  it.todo('middleware:none')
  it.todo('middleware:loggedIn')
  it.todo('middleware:loggedOut')
})
