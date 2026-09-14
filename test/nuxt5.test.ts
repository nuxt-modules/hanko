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

  it('populates the request context from a valid token', async () => {
    const res = await $fetch<{ hanko?: { sub: string } }>('/api/test', {
      headers: await cookie({ sub: 'session-user' }),
    })

    expect(res.hanko?.sub).toBe('session-user')
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
})
