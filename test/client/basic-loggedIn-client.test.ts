import { fileURLToPath } from 'node:url'
import { setup, createPage, useTestContext } from '@nuxt/test-utils'
import defu from 'defu'
import { describe, expect, it } from 'vitest'
import { mockLoggedIn } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn),
})

describe('No global middleware, logged in, client-side', async () => {
  it('renders page with no middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=About page')
    await page.waitForURL(`${useTestContext().url}about`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}about`)
  })

  it('renders page with hanko-logged-in middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Protected page 🔐')
    await page.waitForURL(`${useTestContext().url}protected`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}protected`)
  })

  it('redirects to home page for hanko-logged-out middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Log in page ⛔️👤')
    await page.waitForURL(`${useTestContext().url}`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}`)
  })
})
