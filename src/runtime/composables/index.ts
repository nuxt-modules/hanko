import { Hanko } from '@teamhanko/hanko-elements'
import { useNuxtApp, useRuntimeConfig } from '#imports'

declare module '#app' {
  interface NuxtApp {
    _hanko?: Hanko
  }
}

/**
 * This composable returns a Hanko instance.
 *
 * It will be `null` on the server but defined on the client.
 */
export function useHanko() {
  if (import.meta.server) {
    return null
  }

  const nuxtApp = useNuxtApp()
  if (nuxtApp._hanko) {
    return nuxtApp._hanko
  }

  const hankoConfig = useRuntimeConfig().public.hanko
  nuxtApp._hanko = new Hanko(hankoConfig.apiURL, {
    cookieName: hankoConfig.cookieName,
    localStorageKey: hankoConfig.storageKey,
    cookieSameSite: hankoConfig.cookieSameSite,
    cookieDomain: hankoConfig.cookieDomain,
  })
  return nuxtApp._hanko
}
