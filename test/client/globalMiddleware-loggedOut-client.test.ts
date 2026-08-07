import { fileURLToPath } from 'node:url'
import { setup, createPage, useTestContext } from '@nuxt/test-utils'
import defu from 'defu'
import { describe, expect, it } from 'vitest'
import { enableGlobalMiddleware } from '../config'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
  nuxtConfig: defu(enableGlobalMiddleware),
})

describe('Global middleware, not logged in, client-side', { timeout: 20_000 }, async () => {
  it('redirects to login for page without explicit middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=About page')
    await page.waitForURL(`${useTestContext().url}login?redirect=/about`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/about`)
  })

  it('hanko-logged-in middleware redirects to the login page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Protected page 🔐')
    await page.waitForURL(`${useTestContext().url}login?redirect=/protected`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/protected`)
  })

  it('hanko-logged-out middleware renders page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Log in page ⛔️👤')
    await page.waitForURL(`${useTestContext().url}login`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}login`)
  })

  it('allow:all renders page', async () => {
    const page = await createPage('/login')
    await page.click('#allow-all')
    await page.waitForURL(`${useTestContext().url}global/allow/all`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/allow/all`)
  })

  it('allow:logged-in redirects to login', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#allow-logged-in')
    await page.waitForURL(`${useTestContext().url}login?redirect=/global/allow/logged-in`, {
      timeout: 4000,
    })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/global/allow/logged-in`)
  })

  it('allow:logged-out renders page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#allow-logged-out')
    await page.waitForURL(`${useTestContext().url}global/allow/logged-out`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/allow/logged-out`)
  })

  it('deny:logged-in renders page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#deny-logged-in')
    await page.waitForURL(`${useTestContext().url}global/deny/logged-in`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/deny/logged-in`)
  })

  it('deny:logged-out redirects to login page', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#deny-logged-out')
    await page.waitForURL(`${useTestContext().url}login?redirect=/global/deny/logged-out`, {
      timeout: 4000,
    })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/global/deny/logged-out`)
  })

  it('applies middleware over pageMeta', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#incorrect-usage')
    await page.waitForURL(`${useTestContext().url}login?redirect=/global/incorrect-usage`, {
      timeout: 4000,
    })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/global/incorrect-usage`)
  })
})
