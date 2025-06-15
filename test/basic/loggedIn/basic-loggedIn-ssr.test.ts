import { fetch, setup } from '@nuxt/test-utils'
import defu from 'defu'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { mockLoggedIn } from '../../config'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn),
})

describe('No global middleware, logged in, ssr', async () => {
  it('renders page without middleware', async () => {
    const res = await fetch('/about', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('hanko-logged-in middleware renders page', async () => {
    const res = await fetch('/protected', { redirect: 'manual' })
    expect(res.redirected).toBeFalsy()
  })

  it('hanko-logged-out middleware redirects to the home page', async () => {
    const res = await fetch('/login', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/')
  })
})
