import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
})

describe('ssr', async () => {
  it('renders the index page', async () => {
    const res = await fetch('/', { redirect: 'manual' })
    expect(res.headers.get('location')).toBe('/login')
  })
})
