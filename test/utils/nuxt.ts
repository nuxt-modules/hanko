import { createHooks } from 'hookable'
import { runWithNuxtContext } from '@nuxt/kit'
import type { Nuxt, NuxtConfig } from '@nuxt/schema'
import hankoModule from '../../src/module'
import type { ModuleOptions } from '../../src/module'

/**
 * Runs the module against a minimal Nuxt stub so that only the hooks the module
 * registers are invoked.
 */
export async function setupModule(options: ModuleOptions = {}, overrides: Partial<NuxtConfig> = {}, version = '4.5.2') {
  const hooks = createHooks()
  const nuxt = {
    _version: version,
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
    options: {
      rootDir: process.cwd(),
      buildDir: `${process.cwd()}/.nuxt`,
      srcDir: process.cwd(),
      appConfig: {},
      serverHandlers: [],
      devServerHandlers: [],
      plugins: [],
      nitro: {},
      build: { templates: [] },
      runtimeConfig: { public: {} },
      vue: { compilerOptions: {} },
      ...overrides,
    },
  } as unknown as Nuxt

  await runWithNuxtContext(nuxt, () => hankoModule(options, nuxt))

  return nuxt
}

export function pluginSources(nuxt: Nuxt) {
  return nuxt.options.plugins.map(plugin => typeof plugin === 'string' ? plugin : plugin.src)
}

export async function resolveTypeReferences(nuxt: Nuxt) {
  const references: Array<{ path?: string, types?: string }> = []
  await nuxt.callHook('prepare:types', { references } as never)
  return references.map(reference => reference.path ?? reference.types ?? '')
}

export async function resolveMiddleware(nuxt: Nuxt) {
  const app = { middleware: [] as Array<{ name: string, path: string }> }
  await nuxt.callHook('app:resolve', app as never)
  return app.middleware
}
