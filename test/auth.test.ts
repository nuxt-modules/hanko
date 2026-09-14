import { fileURLToPath } from 'node:url'
import { describe, it, expect, afterAll } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils'
import { createJwksServer } from './utils/jwks'

const jwks = await createJwksServer()
afterAll(() => jwks.close())

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: {
    runtimeConfig: { public: { hanko: { apiURL: jwks.url } } },
  },
})

const cookie = async (payload?: Record<string, unknown>) => ({ cookie: `hanko=${await jwks.sign(payload)}` })

describe('authenticated ssr', () => {
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

  it('renders guarded pages', async () => {
    const res = await fetch('/protected', { headers: await cookie(), redirect: 'manual' })

    expect(res.status).toBe(200)
    expect(await res.text()).toContain('<h1>Protected Page</h1>')
  })

  it('renders unguarded pages', async () => {
    const res = await fetch('/about', { headers: await cookie(), redirect: 'manual' })

    expect(res.status).toBe(200)
  })

  it('redirects away from the login page', async () => {
    const res = await fetch('/login', { headers: await cookie(), redirect: 'manual' })

    expect(res.headers.get('location')).toBe('/')
  })

  it('rejects an expired token', async () => {
    const jwt = await jwks.sign({ sub: 'expired-user' }, { expiresIn: '-1h' })
    const res = await fetch('/protected', { headers: { cookie: `hanko=${jwt}` }, redirect: 'manual' })

    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })

  it('rejects a token signed by an unknown key', async () => {
    const jwt = await jwks.signWithForeignKey()
    const res = await fetch('/protected', { headers: { cookie: `hanko=${jwt}` }, redirect: 'manual' })

    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })
})
