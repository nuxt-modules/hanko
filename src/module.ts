import type { NuxtPage, PublicRuntimeConfig } from 'nuxt/schema'
import { defineNuxtModule, addPlugin, createResolver, addImportsSources, addRouteMiddleware, addServerHandler, addServerImports, addTemplate, addTypeTemplate, getNuxtVersion, useLogger } from '@nuxt/kit'
import type { CookieSameSite, RegisterOptions } from '@teamhanko/hanko-elements'
import { defu } from 'defu'

export interface ModuleOptions {
  /**
   * This can be overridden at runtime by setting NUXT_PUBLIC_HANKO_API_URL
   */
  apiURL?: string
  registerComponents?: boolean
  augmentContext?: boolean
  globalMiddleware?: boolean
  cookieName?: string
  cookieSameSite?: CookieSameSite
  cookieDomain?: string
  storageKey?: string
  redirects?: {
    login?: string
    home?: string
    success?: string
    followRedirect?: boolean
  }
  components?: {
    shadow?: RegisterOptions['shadow']
    injectStyles?: RegisterOptions['injectStyles']
    enablePasskeys?: RegisterOptions['enablePasskeys']
    hidePasskeyButtonOnLogin?: RegisterOptions['hidePasskeyButtonOnLogin']
    translations?: RegisterOptions['translations']
    translationsLocation?: RegisterOptions['translationsLocation']
    fallbackLanguage?: RegisterOptions['fallbackLanguage']
    sessionCheckInterval?: RegisterOptions['sessionCheckInterval']
    sessionTokenLocation?: RegisterOptions['sessionTokenLocation']
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxtjs/hanko',
    configKey: 'hanko',
  },
  defaults: {
    apiURL: '',
    registerComponents: true,
    augmentContext: true,
    globalMiddleware: false,
    cookieName: 'hanko',
    redirects: {
      login: '/login',
      home: '/',
      success: '/',
      followRedirect: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Nuxt 5 server code imports from `nuxt/server`; earlier versions use `h3` and `#imports`
    const isNuxt5 = Number.parseInt(getNuxtVersion(nuxt)) >= 5
    const serverDir = resolver.resolve(isNuxt5 ? './runtime/server-nuxt5' : './runtime/server')
    const serverUtils = resolver.resolve(serverDir, './utils/index')
    const serverMiddleware = resolver.resolve(serverDir, './middleware/auth')

    const isCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      tag.startsWith('hanko-') || isCustomElement?.(tag) || false

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
      hanko: {
        apiURL: options.apiURL!,
        cookieName: options.cookieName!,
        cookieSameSite: options.cookieSameSite || undefined,
        cookieDomain: options.cookieDomain || undefined,
        storageKey: options.storageKey || undefined,
        components: options.components || {},
      } satisfies PublicRuntimeConfig['hanko'],
    }) as PublicRuntimeConfig

    nuxt.options.appConfig = defu(nuxt.options.appConfig, {
      hanko: {
        redirects: options.redirects,
      },
    })

    if (options.registerComponents) {
      if (nuxt.options.vue.runtimeCompiler) {
        addPlugin(resolver.resolve('./runtime/plugins/custom-elements'))
      }
      addPlugin(resolver.resolve('./runtime/plugins/components.client'))
      nuxt.hook('prepare:types', ({ references }) => {
        references.push({
          path: resolver.resolve('./runtime/components.d.ts'),
        })
      })
    }

    if (options.globalMiddleware) {
      if (!nuxt.options.experimental.scanPageMeta) {
        logger.warn('`hanko.globalMiddleware` requires `experimental.scanPageMeta`. Pages cannot opt out with `hanko` page meta while it is disabled.')
      }

      nuxt.options.experimental.extraPageMetaExtractionKeys ||= []
      nuxt.options.experimental.extraPageMetaExtractionKeys.push('hanko')

      nuxt.hook('pages:resolved', guardPages)

      addTypeTemplate({
        filename: 'types/hanko-page-meta.d.ts',
        getContents: () => `declare module 'nuxt/app' {
  interface PageMeta {
    hanko?:
      | { allow?: 'all' | 'logged-in' | 'logged-out', deny?: never }
      | { allow?: never, deny?: 'logged-in' | 'logged-out' }
  }
}

export {}
`,
      })
    }

    if (options.augmentContext) {
      addServerHandler({
        middleware: true,
        // Nitro v3 requires every handler to declare the routes it runs on
        ...isNuxt5 ? { route: '/**' } : {},
        handler: serverMiddleware,
      })
      nuxt.hook('prepare:types', ({ references }) => {
        references.push({
          path: resolver.resolve('./runtime/auth.d.ts'),
        })
      })
    }

    for (const name of ['logged-in', 'logged-out']) {
      addRouteMiddleware({
        name: `hanko-${name}`,
        path: resolver.resolve(`./runtime/middleware/${name}`),
      })
    }

    // Add Vue composables
    addImportsSources({
      from: resolver.resolve('./runtime/composables/index'),
      imports: ['useHanko'],
    })

    const hankoElementsTemplate = addTemplate({
      filename: 'hanko-elements.mjs',
      getContents: () => [
        'export const Hanko = () => null',
        'export const register = () => Promise.resolve({ hanko: null })',
      ].join('\n'),
    })

    nuxt.hook('vite:extendConfig', (config, { isServer }) => {
      if (isServer) {
        config.resolve!.alias = defu(config.resolve!.alias, {
          '@teamhanko/hanko-elements': hankoElementsTemplate.dst,
        })
      }
    })

    // Add Nitro composables
    addServerImports([{ name: 'verifyHankoEvent', from: serverUtils }])

    if (!isNuxt5) {
      nuxt.hook('nitro:config', (config) => {
        config.externals = defu(config.externals, {
          inline: [serverDir, resolver.resolve('./runtime/verify')],
        })
      })
    }
  },
})

const logger = useLogger('@nuxtjs/hanko')

const hankoMiddleware = ['hanko-logged-in', 'hanko-logged-out']

/** Assigns a hanko middleware to every page that does not opt out through its `hanko` page meta. */
function guardPages(pages: NuxtPage[]) {
  for (const page of pages) {
    if (page.children?.length) guardPages(page.children)
    if (!page.file) continue

    const middleware = [page.meta?.middleware ?? []].flat()
    if (middleware.some(name => typeof name === 'string' && hankoMiddleware.includes(name))) continue

    const { allow, deny } = page.meta?.hanko ?? {}
    if (allow === 'all') continue

    page.meta ||= {}
    page.meta.middleware = [
      ...middleware,
      allow === 'logged-out' || deny === 'logged-in' ? 'hanko-logged-out' : 'hanko-logged-in',
    ]
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    hanko: {
      apiURL: NonNullable<ModuleOptions['apiURL']>
      cookieName: NonNullable<ModuleOptions['cookieName']>
      cookieSameSite?: ModuleOptions['cookieSameSite']
      cookieDomain?: ModuleOptions['cookieDomain']
      storageKey?: ModuleOptions['storageKey']
      components: ModuleOptions['components']
    }
  }
}
