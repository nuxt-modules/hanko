import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsSources,
  addRouteMiddleware,
  addServerHandler,
  addTemplate,
} from '@nuxt/kit'
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
  redirects?: {
    login?: string
    home?: string
    success?: string
    followRedirect?: boolean
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
        apiURL: options.apiURL,
        cookieName: options.cookieName,
      },
    })

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

    if (options.globalMiddleware) {
      addRouteMiddleware({
        name: 'hanko-global-logged-in',
        path: resolver.resolve('./runtime/middleware/global-logged-in'),
        global: true,
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
