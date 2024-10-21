import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsSources,
  addRouteMiddleware,
  addServerHandler,
  addTemplate,
} from '@nuxt/kit'
import type { Translation, CookieSameSite } from '@teamhanko/hanko-elements'
import { defu } from 'defu'

// Manually declaring this interface since it's not being exported from Hanko
interface Translations {
  [lang: string]: Partial<Translation>
}
export interface ModuleOptions {
  /**
   * This can be overridden at runtime by setting NUXT_PUBLIC_HANKO_API_URL
   */
  apiURL?: string
  registerComponents?: boolean
  augmentContext?: boolean
  cookieName?: string
  redirects?: {
    login?: string
    home?: string
    success?: string
    followRedirect?: boolean
  }
  cookieSameSite?: CookieSameSite
  cookieDomain?: string
  shadow?: boolean
  injectStyles?: boolean
  enablePasskeys?: boolean
  hidePasskeyButtonOnLogin?: boolean
  translations?: Translations
  translationsLocation?: string
  fallbackLanguage?: string
  storageKey?: string
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

    const { registerComponents, augmentContext, redirects, ...hankoOptions } = options

    const isCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) =>
      tag.startsWith('hanko-') || isCustomElement?.(tag) || false

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
      hanko: hankoOptions,
    })

    nuxt.options.appConfig = defu(nuxt.options.appConfig, {
      hanko: {
        redirects: redirects,
      },
    })

    if (registerComponents) {
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

    if (augmentContext) {
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
