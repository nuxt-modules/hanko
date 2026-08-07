import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
})

describe('No global middleware, not logged in, ssr', async () => {
  it('respects custom elements', async () => {
    const html = await $fetch('/login')
    expect(html).toContain('<hanko-auth></hanko-auth>')
  })

  it('pageMeta:hanko has no effect without global middleware', async () => {
    const res = await fetch('/global/allow/logged-in', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('hanko-logged-in middleware redirects to the login page', async () => {
    const res = await fetch('/protected', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })

  it('hanko-logged-out middleware renders page', async () => {
    const res = await fetch('/login', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('renders page without middleware', async () => {
    const res = await fetch('/about', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })
})
