import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'
import { createJwksServer } from './utils/jwks'

const jwks = await createJwksServer()
afterAll(() => jwks.close())

await setup({
  rootDir: fileURLToPath(new URL('../playground-nuxt5', import.meta.url)),
  nuxtConfig: {
    runtimeConfig: { public: { hanko: { apiURL: jwks.url } } },
  },
})

const cookie = async (payload?: Record<string, unknown>) => ({ cookie: `hanko=${await jwks.sign(payload)}` })

describe('nuxt 5', () => {
  it('redirects logged out users to the login page', async () => {
    const res = await fetch('/protected', { redirect: 'manual' })
    expect(new URL(res.headers.get('location')!, 'http://localhost').searchParams.get('redirect')).toBe('/protected')
  })

  it('respects custom elements', async () => {
    const html = await $fetch<string>('/login')
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

  it('populates the request context from a valid token', async () => {
    const res = await $fetch<{ hanko?: { sub: string, email: { address: string } } }>('/api/test', {
      headers: await cookie({ sub: 'session-user' }),
    })

    expect(res.hanko?.sub).toBe('session-user')
    expect(res.hanko?.email.address).toBe('test@example.com')
  })

  it('accepts a bearer token', async () => {
    const res = await $fetch<{ hanko?: { sub: string } }>('/api/test', {
      headers: { authorization: `Bearer ${await jwks.sign({ sub: 'bearer-user' })}` },
    })

    expect(res.hanko?.sub).toBe('bearer-user')
  })

  it('renders guarded pages for logged in users', async () => {
    const res = await fetch('/protected', { headers: await cookie(), redirect: 'manual' })

    expect(res.status).toBe(200)
    expect(await res.text()).toContain('<h1>Protected Page</h1>')
  })

  it('redirects logged in users away from the login page', async () => {
    const res = await fetch('/login', { headers: await cookie(), redirect: 'manual' })

    expect(res.headers.get('location')).toBe('/')
  })

  it('rejects an expired token', async () => {
    const jwt = await jwks.sign({ sub: 'expired-user' }, { expiresIn: '-1h' })
    const res = await fetch('/protected', { headers: { cookie: `hanko=${jwt}` }, redirect: 'manual' })

    expect(decodeURIComponent(res.headers.get('location')!)).toBe('/login?redirect=/protected')
  })

  it('rejects a token signed by an unknown key', async () => {
    const jwt = await jwks.signWithForeignKey()
    const res = await fetch('/protected', { headers: { cookie: `hanko=${jwt}` }, redirect: 'manual' })

    expect(decodeURIComponent(res.headers.get('location')!)).toBe('/login?redirect=/protected')
  })
})
