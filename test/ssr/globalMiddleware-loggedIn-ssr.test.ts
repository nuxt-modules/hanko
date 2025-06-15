import { fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware, mockLoggedIn } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn, enableGlobalMiddleware),
})

describe('Global middleware, logged in, ssr', async () => {
  it('hanko-logged-in middleware renders page', async () => {
    const res = await fetch('/protected', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('hanko-logged-out middleware redirects to home page', async () => {
    const res = await fetch('/login', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/')
  })

  it('renders page without explicit middleware', async () => {
    const res = await fetch('/about', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('allow:all renders page', async () => {
    const res = await fetch('/global/allow/all', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('allow:logged-in renders page', async () => {
    const res = await fetch('/global/allow/logged-in', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('allow:logged-out redirects to home page', async () => {
    const res = await fetch('/global/allow/logged-out', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/')
  })

  it('deny:logged-in redirects to home page', async () => {
    const res = await fetch('/global/deny/logged-in', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/')
  })

  it('deny:logged-out renders page', async () => {
    const res = await fetch('/global/deny/logged-out', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })
})
