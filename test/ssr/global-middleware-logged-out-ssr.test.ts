import { fileURLToPath } from 'node:url'
import { fetch, setup } from '@nuxt/test-utils'
import { describe, expect, it } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: { hanko: { globalMiddleware: true } },
})

const location = async (path: string) =>
  (await fetch(path, { redirect: 'manual' })).headers.get('location')

describe('Global middleware, not logged in, ssr', () => {
  it('hanko-logged-in middleware redirects to the login page', async () => {
    expect(await location('/protected')).toBe('/login?redirect=/protected')
  })

  it('hanko-logged-out middleware renders page', async () => {
    expect((await fetch('/login', { redirect: 'manual' })).status).toBe(200)
  })

  it('redirects to login for page without explicit middleware', async () => {
    expect(await location('/about')).toBe('/login?redirect=/about')
  })

  it('allow:all renders page', async () => {
    expect((await fetch('/global/allow/all', { redirect: 'manual' })).status).toBe(200)
  })

  it('allow:logged-in redirects to login', async () => {
    expect(await location('/global/allow/logged-in')).toBe('/login?redirect=/global/allow/logged-in')
  })

  it('allow:logged-out renders page', async () => {
    expect((await fetch('/global/allow/logged-out', { redirect: 'manual' })).status).toBe(200)
  })

  it('deny:logged-in renders page', async () => {
    expect((await fetch('/global/deny/logged-in', { redirect: 'manual' })).status).toBe(200)
  })

  it('deny:logged-out redirects to login', async () => {
    expect(await location('/global/deny/logged-out')).toBe('/login?redirect=/global/deny/logged-out')
  })

  it('applies middleware over pageMeta', async () => {
    expect(await location('/global/incorrect-usage')).toBe('/login?redirect=/global/incorrect-usage')
  })
})
