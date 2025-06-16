import { setup } from '@nuxt/test-utils'
import { createPage, useTestContext } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../../playground', import.meta.url)),
})

describe('No global middleware, not logged in, client-side', async () => {
  it('pageMeta:hanko has no effect without global middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('#allow-logged-in')
    await page.waitForURL(`${useTestContext().url}global/allow/logged-in`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}global/allow/logged-in`)
  })

  it('renders page with no middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=About page')
    await page.waitForURL(`${useTestContext().url}about`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}about`)
  })

  it('redirects to login page for hanko-logged-in middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Protected page 🔐')
    await page.waitForURL(`${useTestContext().url}login?redirect=/protected`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}login?redirect=/protected`)
  })

  it('renders page with hanko-logged-out middleware', async () => {
    const page = await createPage('/global/allow/all')
    await page.click('text=Log in page ⛔️👤')
    await page.waitForURL(`${useTestContext().url}login`, { timeout: 4000 })
    expect(page.url()).toBe(`${useTestContext().url}login`)
  })
})
