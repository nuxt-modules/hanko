import { fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware } from './config'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: defu(enableGlobalMiddleware),
})

describe('Global middleware, not logged in', async () => {
  describe('ssr', () => {
    it('hanko-logged-in middleware redirects to the login page', async () => {
      const res = await fetch('/protected', { redirect: 'manual' })
      expect(res.headers.get('location')).toBe('/login?redirect=/protected')
    })

    it('hanko-logged-out middleware renders page', async () => {
      const res = await fetch('/login', { redirect: 'manual' })
      expect(res.redirected).toBeFalsy()
    })

    it('redirects to login for page without explicit middleware', async () => {
      const res = await fetch('/about', { redirect: 'manual' })
      expect(res.headers.get('location')).toBe('/login?redirect=/about')
    })

    it('allow:all renders page', async () => {
      const res = await fetch('/global/allow/all', { redirect: 'manual' })
      expect(res.redirected).toBeFalsy()
    })

    it('allow:logged-in redirects to login', async () => {
      const res = await fetch('/global/allow/logged-in', { redirect: 'manual' })
      expect(res.headers.get('location')).toBe('/login?redirect=/global/allow/logged-in')
    })

    it('allow:logged-out renders page', async () => {
      const res = await fetch('/global/allow/logged-out', { redirect: 'manual' })
      expect(res.redirected).toBeFalsy()
    })

    it('deny:logged-in renders page', async () => {
      const res = await fetch('/global/deny/logged-in', { redirect: 'manual' })
      expect(res.redirected).toBeFalsy()
    })

    it('deny:logged-out redirects to login', async () => {
      const res = await fetch('/global/deny/logged-out', { redirect: 'manual' })
      expect(res.headers.get('location')).toBe('/login?redirect=/global/deny/logged-out')
    })
  })

  describe('client', () => {
    it.todo('none')
    it.todo('loggedIn')
    it.todo('loggedOut')
    it.todo('allow:all')
    it.todo('allow:logged-in')
    it.todo('allow:logged-out')
    it.todo('deny:logged-in')
    it.todo('deny:logged-out')
  })

  it('applies middleware over pageMeta', async () => {
    const res = await fetch('/global/incorrect-usage', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/login?redirect=/global/incorrect-usage')
  })
})
