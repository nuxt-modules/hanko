import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('ssr', () => {
  it('redirects to the login page', async () => {
    const res = await fetch('/protected', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })

  it('preserves the requested path in the redirect query', async () => {
    const res = await fetch('/user', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/login?redirect=/user')
  })

  it('respects custom elements', async () => {
    const html = await $fetch('/login')
    expect(html).toContain('<hanko-auth></hanko-auth>')
  })

  it('renders unguarded pages', async () => {
    const html = await $fetch<string>('/about')
    expect(html).toContain('<h1>About</h1>')
  })

  it('does not redirect logged out users away from the login page', async () => {
    const res = await fetch('/login', { redirect: 'manual' })
    expect(res.status).toBe(200)
  })

  it('leaves the request context unauthenticated without a token', async () => {
    expect(await $fetch('/api/test')).toStrictEqual({})
  })

  it('leaves the request context unauthenticated for an invalid token', async () => {
    const res = await $fetch('/api/test', { headers: { cookie: 'hanko=not-a-jwt' } })
    expect(res).toStrictEqual({})
  })
})
