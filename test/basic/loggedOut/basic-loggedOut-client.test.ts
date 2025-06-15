import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('No global middleware, not logged in, client-side', async () => {
  it.todo('middleware:none')
  it.todo('middleware:loggedIn')
  it.todo('middleware:loggedOut')
})
