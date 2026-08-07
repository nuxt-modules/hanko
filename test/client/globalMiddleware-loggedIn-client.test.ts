import { fileURLToPath } from 'node:url'
import { setup, createPage, useTestContext } from '@nuxt/test-utils'
import defu from 'defu'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware, mockLoggedIn } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(mockLoggedIn, enableGlobalMiddleware),
})

describe('Global middleware, logged in, client-side', { timeout: 20_000 }, async () => {
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

  it('allow:all renders page', async () => {
    const page = await createPage('/about')
    await page.click('#allow-all')
    await page.waitForURL(`${useTestContext().url}global/allow/all`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/allow/all`)
  })

  it('allow:logged-in renders page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#allow-logged-in')
    await page.waitForURL(`${useTestContext().url}global/allow/logged-in`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/allow/logged-in`)
  })

  it('allow:logged-out redirects to home page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#allow-logged-out')
    await page.waitForURL(`${useTestContext().url}`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}`)
  })

  it('deny:logged-in redirects to home page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#deny-logged-in')
    await page.waitForURL(`${useTestContext().url}`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}`)
  })

  it('deny:logged-out renders page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#deny-logged-out')
    await page.waitForURL(`${useTestContext().url}global/deny/logged-out`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/deny/logged-out`)
  })
})
