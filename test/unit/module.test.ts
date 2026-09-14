import { describe, it, expect } from 'vitest'
import { setupModule, pluginSources, resolveMiddleware, resolveTypeReferences } from '../utils/nuxt'

interface NitroConfigStub {
  externals?: { inline: string[] }
  imports?: { imports?: Array<{ name: string, from: string }> }
}
interface ViteConfigStub {
  resolve: { alias?: Record<string, string> }
}

describe('module options', () => {
  it('applies default runtime config and app config', async () => {
    const nuxt = await setupModule()

    expect(nuxt.options.runtimeConfig.public.hanko).toStrictEqual({
      apiURL: '',
      cookieName: 'hanko',
      cookieSameSite: undefined,
      cookieDomain: undefined,
      storageKey: undefined,
      components: {},
    })
    expect(nuxt.options.appConfig.hanko).toStrictEqual({
      redirects: { login: '/login', home: '/', success: '/', followRedirect: true },
    })
  })

  it('exposes user options through public runtime config', async () => {
    const nuxt = await setupModule({
      apiURL: 'https://hanko.example.com',
      cookieName: 'my-cookie',
      cookieSameSite: 'strict',
      cookieDomain: 'example.com',
      storageKey: 'my-storage-key',
      components: { shadow: false, enablePasskeys: false },
    })

    expect(nuxt.options.runtimeConfig.public.hanko).toStrictEqual({
      apiURL: 'https://hanko.example.com',
      cookieName: 'my-cookie',
      cookieSameSite: 'strict',
      cookieDomain: 'example.com',
      storageKey: 'my-storage-key',
      components: { shadow: false, enablePasskeys: false },
    })
  })

  it('does not override runtime config set by the user', async () => {
    const nuxt = await setupModule(
      { apiURL: 'https://module.example.com', cookieName: 'module-cookie' },
      { runtimeConfig: { public: { hanko: { apiURL: 'https://user.example.com' } } } as never },
    )

    expect(nuxt.options.runtimeConfig.public.hanko).toMatchObject({
      apiURL: 'https://user.example.com',
      cookieName: 'module-cookie',
    })
  })

  it('merges redirects with the defaults', async () => {
    const nuxt = await setupModule({ redirects: { success: '/user', followRedirect: false } })

    expect(nuxt.options.appConfig.hanko.redirects).toStrictEqual({
      login: '/login',
      home: '/',
      success: '/user',
      followRedirect: false,
    })
  })
})

describe('custom elements', () => {
  it('treats hanko-* tags as custom elements', async () => {
    const nuxt = await setupModule()
    const isCustomElement = nuxt.options.vue.compilerOptions!.isCustomElement!

    expect(isCustomElement('hanko-auth')).toBe(true)
    expect(isCustomElement('hanko-profile')).toBe(true)
    expect(isCustomElement('div')).toBe(false)
  })

  it('preserves a user-provided isCustomElement', async () => {
    const nuxt = await setupModule({}, {
      vue: { compilerOptions: { isCustomElement: (tag: string) => tag === 'my-element' } },
    })
    const isCustomElement = nuxt.options.vue.compilerOptions!.isCustomElement!

    expect(isCustomElement('hanko-auth')).toBe(true)
    expect(isCustomElement('my-element')).toBe(true)
    expect(isCustomElement('div')).toBe(false)
  })
})

describe('registered runtime code', () => {
  it('registers the client plugin and component types', async () => {
    const nuxt = await setupModule()

    expect(pluginSources(nuxt).some(src => src.includes('runtime/plugins/components.client'))).toBe(true)
    expect(await resolveTypeReferences(nuxt)).toContainEqual(expect.stringContaining('runtime/components.d.ts'))
  })

  it('skips component registration when disabled', async () => {
    const nuxt = await setupModule({ registerComponents: false })

    expect(pluginSources(nuxt)).toStrictEqual([])
    expect(await resolveTypeReferences(nuxt)).not.toContainEqual(expect.stringContaining('runtime/components.d.ts'))
  })

  it('adds the runtime compiler plugin only when the runtime compiler is enabled', async () => {
    const withoutCompiler = await setupModule()
    expect(pluginSources(withoutCompiler).some(src => src.includes('runtime/plugins/custom-elements'))).toBe(false)

    const withCompiler = await setupModule({}, { vue: { runtimeCompiler: true, compilerOptions: {} } })
    expect(pluginSources(withCompiler).some(src => src.includes('runtime/plugins/custom-elements'))).toBe(true)
  })

  it('registers both route middleware', async () => {
    const nuxt = await setupModule()
    const middleware = await resolveMiddleware(nuxt)

    expect(middleware.map(item => item.name).sort()).toStrictEqual(['hanko-logged-in', 'hanko-logged-out'])
    expect(middleware.every(item => item.path.includes('runtime/middleware/'))).toBe(true)
  })

  it('auto-imports useHanko', async () => {
    const nuxt = await setupModule()
    const presets: Array<{ from: string, imports: string[] }> = []
    await nuxt.callHook('imports:sources', presets as never)

    expect(presets).toHaveLength(1)
    expect(presets[0]!.imports).toStrictEqual(['useHanko'])
    expect(presets[0]!.from).toContain('runtime/composables/index')
  })
})

describe('server integration', () => {
  it('registers the auth middleware and context types', async () => {
    const nuxt = await setupModule()

    expect(nuxt.options.serverHandlers).toContainEqual(expect.objectContaining({
      middleware: true,
      handler: expect.stringContaining('runtime/server/middleware/auth'),
    }))
    expect(await resolveTypeReferences(nuxt)).toContainEqual(expect.stringContaining('runtime/auth.d.ts'))
  })

  it('skips context augmentation when disabled', async () => {
    const nuxt = await setupModule({ augmentContext: false })

    expect(nuxt.options.serverHandlers).toStrictEqual([])
    expect(await resolveTypeReferences(nuxt)).not.toContainEqual(expect.stringContaining('runtime/auth.d.ts'))
  })

  it('inlines runtime server code and auto-imports verifyHankoEvent in nitro', async () => {
    const nuxt = await setupModule()
    const config: NitroConfigStub = {}
    await nuxt.callHook('nitro:config', config as never)

    expect(config.externals!.inline).toContainEqual(expect.stringContaining('runtime/server'))
    expect(config.externals!.inline).toContainEqual(expect.stringContaining('runtime/verify'))
    expect(config.imports!.imports).toHaveLength(1)
    expect(config.imports!.imports![0]!.name).toBe('verifyHankoEvent')
    expect(config.imports!.imports![0]!.from).toContain('runtime/server/utils/index')
  })

  it('preserves existing nitro externals', async () => {
    const nuxt = await setupModule()
    const config: NitroConfigStub = { externals: { inline: ['my-package'] } }
    await nuxt.callHook('nitro:config', config as never)

    expect(config.externals!.inline).toContain('my-package')
    expect(config.externals!.inline).toContainEqual(expect.stringContaining('runtime/server'))
  })

  it('stubs hanko-elements for the server build only', async () => {
    const nuxt = await setupModule()
    const serverConfig: ViteConfigStub = { resolve: {} }
    const clientConfig: ViteConfigStub = { resolve: {} }

    await nuxt.callHook('vite:extendConfig', serverConfig as never, { isServer: true, isClient: false } as never)
    await nuxt.callHook('vite:extendConfig', clientConfig as never, { isServer: false, isClient: true } as never)

    expect(serverConfig.resolve.alias!['@teamhanko/hanko-elements']).toContain('hanko-elements.mjs')
    expect(clientConfig.resolve.alias).toBeUndefined()
  })

  it('uses nuxt/server runtime code and a wildcard route on nuxt 5', async () => {
    const nuxt = await setupModule({}, {}, '5.0.0')

    expect(nuxt.options.serverHandlers).toContainEqual(expect.objectContaining({
      middleware: true,
      route: '/**',
      handler: expect.stringContaining('runtime/server-nuxt5/middleware/auth'),
    }))

    const config: NitroConfigStub = {}
    await nuxt.callHook('nitro:config', config as never)

    expect(config.imports!.imports![0]!.from).toContain('runtime/server-nuxt5/utils/index')
    expect(config.externals).toBeUndefined()
  })

  it('does not set a route for the middleware on nuxt 4', async () => {
    const nuxt = await setupModule()

    expect(nuxt.options.serverHandlers[0]).not.toHaveProperty('route')
  })

  it('adds a hanko-elements stub template', async () => {
    const nuxt = await setupModule()
    const template = nuxt.options.build.templates.find(item => item.filename === 'hanko-elements.mjs')

    expect(template).toBeDefined()
    expect(await template!.getContents!({} as never)).toContain('export const Hanko')
  })
})
