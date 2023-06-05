import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsSources,
  addRouteMiddleware,
  addServerHandler,
} from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  /**
   * This can be overridden at runtime by setting NUXT_PUBLIC_HANKO_API_URL
   */
  apiURL?: string
  registerComponents?: boolean
  augmentContext?: boolean
  redirects?: {
    login?: string
    home?: string
    success?: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-hanko',
    configKey: 'hanko',
  },
  defaults: {
    apiURL: '',
    registerComponents: true,
    augmentContext: true,
    redirects: {
      login: '/login',
      home: '/',
      success: '/',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const isCustomElement = nuxt.options.vue.compilerOptions.isCustomElement
    nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) => tag.startsWith("hanko-") || isCustomElement?.(tag)

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
      hanko: {
        apiURL: options.apiURL,
      },
    })

    nuxt.options.appConfig = defu(nuxt.options.appConfig, {
      hanko: {
        redirects: options.redirects,
      },
    })

    if (options.registerComponents) {
      addPlugin(resolver.resolve('./runtime/plugins/custom-elements'))
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
        handler: resolver.resolve('./runtime/server/middleware/auth')
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

    // Add Nitro composables
    nuxt.hook('nitro:config', config => {
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
