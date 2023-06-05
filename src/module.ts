import { defineNuxtModule, addPlugin, createResolver, addImportsSources, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * This can be overridden at runtime by setting NUXT_PUBLIC_HANKO_API_URL
   */
  apiURL?: string
  redirects?: {
    login?: string
    home?: string
    success?: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-hanko',
    configKey: 'hanko'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiURL: '',
    redirects: {
      login: '/login',
      home: '/',
      success: '/'
    }
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, {
      hanko: {
        apiURL: options.apiURL
      }
    })

    nuxt.options.appConfig = defu(nuxt.options.appConfig, {
      hanko: {
        redirects: options.redirects
      }
    })

    addPlugin(resolver.resolve('./runtime/plugins/components'))
    for (const name of ['logged-in', 'logged-out']) {
      addRouteMiddleware({
        name: `hanko-${name}`,
        path: resolver.resolve(`./runtime/middleware/${name}`) 
      })
    }
    addImportsSources({
      from: resolver.resolve('./runtime/composables/index'),
      imports: ['useHanko']
    })

    nuxt.hook('nitro:config', config => {
      config.imports = defu(config.imports, {
        presets: [
          {
            from: resolver.resolve('./runtime/server/utils/index'),
            imports: ['verifyHankoEvent']
          }
        ]
      })
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolver.resolve('./runtime/components.d.ts')
      })
    })
  }
})
