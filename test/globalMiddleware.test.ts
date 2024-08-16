import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  nuxtConfig: { hanko: { globalMiddleware: true } },
})

const fetchOptions: RequestInit = { redirect: 'manual' }

describe('logged-out user', async () => {
  it('allows pages with `hanko-logged-out` middleware', async () => {
    const res = await fetch('/login', fetchOptions)
    expect(res.status).toBe(200)
  })

  it('`hanko-logged-in` middleware redirects to the login page', async () => {
    const res = await fetch('/protected', fetchOptions)
    expect(res.headers.get('location')).toBe('/login?redirect=/protected')
  })

  it('global middleware redirects on page without explicit middleware', async () => {
    const res = await fetch('/', fetchOptions)
    expect(res.headers.get('location')).toBe('/login?redirect=/')
  })

  it('allows `hanko-allow-all` with global middleware', async () => {
    const res = await fetch('/about', fetchOptions)
    expect(res.status).toBe(200)
  })
})

describe('logged-in user', async () => {
  const authenticatedFetchOptions: RequestInit = {
    ...fetchOptions,
    headers: {
      cookie:
        // This will not work. It was an actually valid cookie, signed for localhost:3000, but it has a lifetime of 1 hour.
        'hanko=eyJhbGciOiJSUzI1NiIsImtpZCI6IjVjYzU1MDFmLWYxNWQtNDY0Ni1iMmRiLTlkNzcwODgwYWM0NCIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsibG9jYWxob3N0Il0sImVtYWlsIjp7ImFkZHJlc3MiOiJtYWlsQGZlbGl4ZG9sZGVyZXIuY29tIiwiaXNfcHJpbWFyeSI6dHJ1ZSwiaXNfdmVyaWZpZWQiOnRydWV9LCJleHAiOjE3MjM4NTQ2NDQsImlhdCI6MTcyMzgxMTQ0NCwic3ViIjoiN2JiNzE1MDktMWU4YS00MGY5LTlmY2EtM2ViZjg1NjdjNGJkIn0.wSzfcdCcqs-oQB2Ifq-bKqfJTxwIS9q1xw_2E6lVeRd3dyIcJPtaSHAY-mS798GjKuC9DpkaHQyWVV28xcriY7Csvu09vrFfcqcX1cj_y9eKQPp9J_q1Dt8-Q5hOuXasMxQZg9s9R0OgLXVXqQ_G8M5BBu68ahANR9pK1cxyJ0QN5u04FpK5xmgNsdgKvEqaQqgbdvU5h-7F-GBl07of8c4VTd2NmuNl9jINdeTSYpkbEFEDljjG4ll2tw3CSfCSR_aonz3WR2R2bjbMuIVPW6HnDKcAdJ2eXdF7L3kfqg-NdA-IrPef9GlmlFDNbrTdrH8WWhZ17x-euRsJd08VAD0TiJWPoPyV_S0T9W-J6Dsle0zn6frbXkzcQnDQVEZv7w6nCWZaAhfqEbJUni9aE8BDskOZRC2aRDyntfGTymfUo0KheJ5NgzaWEME4VAT0zhWymJwOaY1LqdSeYowu1iet_yYnq6fdWPKRehxvZGIFsfKRBcO17INGwDQFDn0n6c1zsIqUYTNh6vp0H4q3mdwQPsnC2gtVA8phYiRr0uznumfLIjEoB53xvU2l0r_IVZukDY89kqxkdgwe1o5kl5Z43cgAG1Ohv1EVeM0z7aYYMqrrDfC7lTxTSVG07IjtP75NMZVKsmUzhKLtM1PaIuEYUi4RPlRxBsizJag_MIs',
    },
  }

  it('allows pages with `hanko-logged-in` middleware', async () => {
    const res = await fetch('/protected', authenticatedFetchOptions)
    expect(res.status).toBe(200)
  })

  it('`hanko-logged-out` redirects logged-in user to the home page', async () => {
    const res = await fetch('/login', authenticatedFetchOptions)
    expect(res.headers.get('location')).toBe('/')
  })

  it('allows page without explicit middleware', async () => {
    const res = await fetch('/', authenticatedFetchOptions)
    expect(res.status).toBe(200)
  })

  it('allows `hanko-allow-all` with global middleware', async () => {
    const res = await fetch('/about', authenticatedFetchOptions)
    expect(res.status).toBe(200)
  })
})
