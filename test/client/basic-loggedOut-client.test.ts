import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
})

describe('No global middleware, not logged in, client-side', async () => {
  it('pageMeta:hanko has no effect without global middleware', async () => {})

  it('renders page with no middleware', async () => {})

  it('redirects to login page for hanko-logged-in middleware', async () => {})

  it('renders page with hanko-logged-out middleware', async () => {})
})
