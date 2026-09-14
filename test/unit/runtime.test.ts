import { describe, it, expect, beforeEach, vi } from 'vitest'
import { hankoTestState, resetHankoTestState } from '../mocks/imports'

const { Hanko, register } = vi.hoisted(() => ({
  Hanko: vi.fn(function (this: Record<string, unknown>, apiURL: string, options: Record<string, unknown>) {
    this.apiURL = apiURL
    this.options = options
  }),
  register: vi.fn(() => Promise.resolve()),
}))

vi.mock('@teamhanko/hanko-elements', () => ({ Hanko, register }))

const { useHanko } = await import('../../src/runtime/composables/index')
const componentsPlugin = (await import('../../src/runtime/plugins/components.client')).default
const customElementsPlugin = (await import('../../src/runtime/plugins/custom-elements')).default

beforeEach(() => {
  resetHankoTestState()
  vi.clearAllMocks()
})

describe('useHanko', () => {
  it('creates a Hanko instance from the runtime config', () => {
    hankoTestState.runtimeConfig.public.hanko = {
      apiURL: 'https://hanko.example.com',
      cookieName: 'my-cookie',
      storageKey: 'my-storage-key',
      cookieSameSite: 'strict',
      cookieDomain: 'example.com',
    }

    const hanko = useHanko()

    expect(Hanko).toHaveBeenCalledWith('https://hanko.example.com', {
      cookieName: 'my-cookie',
      localStorageKey: 'my-storage-key',
      cookieSameSite: 'strict',
      cookieDomain: 'example.com',
    })
    expect(hanko).toBeInstanceOf(Hanko)
  })

  it('reuses the instance stored on the nuxt app', () => {
    const first = useHanko()
    const second = useHanko()

    expect(second).toBe(first)
    expect(Hanko).toHaveBeenCalledTimes(1)
  })
})

describe('components plugin', () => {
  it('registers hanko elements once the app is mounted', async () => {
    hankoTestState.runtimeConfig.public.hanko = {
      apiURL: 'https://hanko.example.com',
      storageKey: 'my-storage-key',
      cookieSameSite: 'lax',
      cookieDomain: 'example.com',
      components: { shadow: false },
    }

    let mounted: (() => Promise<void>) | undefined
    const nuxtApp = {
      hook: (name: string, callback: () => Promise<void>) => {
        if (name === 'app:mounted') {
          mounted = callback
        }
      },
    }

    componentsPlugin(nuxtApp as never)
    await mounted!()

    expect(register).toHaveBeenCalledWith('https://hanko.example.com', {
      storageKey: 'my-storage-key',
      cookieSameSite: 'lax',
      cookieDomain: 'example.com',
      shadow: false,
    })
  })
})

describe('custom elements plugin', () => {
  it('treats hanko-* tags as custom elements', () => {
    const vueApp = { config: { compilerOptions: { isCustomElement: (tag: string) => tag === 'my-element' } } }

    customElementsPlugin({ vueApp } as never)

    expect(vueApp.config.compilerOptions.isCustomElement('hanko-auth')).toBe(true)
    expect(vueApp.config.compilerOptions.isCustomElement('my-element')).toBe(true)
    expect(vueApp.config.compilerOptions.isCustomElement('div')).toBe(false)
  })
})
