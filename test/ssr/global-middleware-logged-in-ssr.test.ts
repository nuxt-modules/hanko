import { fileURLToPath } from 'node:url'
import { fetch, setup } from '@nuxt/test-utils'
import { afterAll, describe, expect, it } from 'vitest'
import { createJwksServer } from '../utils/jwks'

const jwks = await createJwksServer()
afterAll(() => jwks.close())

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: {
    hanko: { globalMiddleware: true },
    runtimeConfig: { public: { hanko: { apiURL: jwks.url } } },
  },
})

const get = async (path: string) =>
  fetch(path, { headers: { cookie: `hanko=${await jwks.sign()}` }, redirect: 'manual' })

describe('Global middleware, logged in, ssr', () => {
  it('hanko-logged-in middleware renders page', async () => {
    expect((await get('/protected')).status).toBe(200)
  })

  it('hanko-logged-out middleware redirects to home page', async () => {
    expect((await get('/login')).headers.get('location')).toBe('/')
  })

  it('renders page without explicit middleware', async () => {
    expect((await get('/about')).status).toBe(200)
  })

  it('allow:all renders page', async () => {
    expect((await get('/global/allow/all')).status).toBe(200)
  })

  it('allow:logged-in renders page', async () => {
    expect((await get('/global/allow/logged-in')).status).toBe(200)
  })

  it('allow:logged-out redirects to home page', async () => {
    expect((await get('/global/allow/logged-out')).headers.get('location')).toBe('/')
  })

  it('deny:logged-in redirects to home page', async () => {
    expect((await get('/global/deny/logged-in')).headers.get('location')).toBe('/')
  })

  it('deny:logged-out renders page', async () => {
    expect((await get('/global/deny/logged-out')).status).toBe(200)
  })
})
