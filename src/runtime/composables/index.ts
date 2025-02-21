import { Hanko } from '@teamhanko/hanko-elements'
import { useRuntimeConfig } from '#imports'

/**
 * This composable returns a Hanko instance.
 *
 * It will be `null` on the server but defined on the client.
 */
export function useHanko() {
  if (import.meta.server) {
    return null
  }

  const hankoConfig = useRuntimeConfig().public.hanko
  return new Hanko(hankoConfig.apiURL, {
    cookieName: hankoConfig.cookieName,
    localStorageKey: hankoConfig.storageKey,
    cookieSameSite: hankoConfig.cookieSameSite,
    cookieDomain: hankoConfig.cookieDomain,
  })
}
