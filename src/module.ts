import type { PublicRuntimeConfig } from 'nuxt/schema'
import { defineNuxtModule, addPlugin, createResolver, addImportsSources, addRouteMiddleware, addServerHandler, addTemplate } from '@nuxt/kit'
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

    const isCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      tag.startsWith('hanko-') || isCustomElement?.(tag) || false

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
      hanko: {
        apiURL: options.apiURL!,
        cookieName: options.cookieName!,
        cookieSameSite: options.cookieSameSite || undefined,
        cookieDomain: options.cookieDomain || undefined,
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
      addRouteMiddleware({
        name: 'hanko-global-logged-in',
        path: resolver.resolve('./runtime/middleware/global-logged-in'),
        global: true,
      })
    }


    if (options.augmentContext) {
      addServerHandler({
        middleware: true,
        handler: resolver.resolve('./runtime/server/middleware/auth'),
      })
      nuxt.hook('prepare:types', ({ references }) => {
        references.push({
          path: resolver.resolve('./runtime/auth.d.ts'),
        })
      })
    }

    for (const name of ['allow-all', 'logged-in', 'logged-out']) {
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
    addImportsSources({
      from: resolver.resolve('./runtime/middleware/logged-in.ts'),
      imports: ['hankoLoggedIn'],
    })
    addImportsSources({
      from: resolver.resolve('./runtime/middleware/logged-out.ts'),
      imports: ['hankoLoggedOut'],
    })

    const hankoElementsTemplate = addTemplate({
      filename: 'hanko-elements.mjs',
      getContents: () => `export const Hanko = () => null`,
    })

    nuxt.hook('vite:extendConfig', (config, { isServer }) => {
      if (isServer) {
        config.resolve!.alias = defu(config.resolve!.alias, {
          '@teamhanko/hanko-elements': hankoElementsTemplate.dst,
        })
      }
    })

    // Add Nitro composables
    nuxt.hook('nitro:config', (config) => {
      config.externals = defu(config.externals, {
        inline: [resolver.resolve('./runtime/server')],
      })
      config.imports = defu(config.imports, {
        presets: [
          {
            from: resolver.resolve('./runtime/server/utils/index'),
            imports: ['verifyHankoEvent'],
          },
        ],
      })
    })
  },
})

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
