import { useRuntimeConfig } from '#imports'
import { Hanko } from '@teamhanko/hanko-elements'

/**
 * This composable returns a Hanko instance.
 *
 * It will be `null` on the server but defined on the client.
 */
export function useHanko() {
  if (process.server) {
    return null
  }

  const hankoConfig = useRuntimeConfig().public.hanko
  const hankoOptions = {
    cookieName: hankoConfig.cookieName,
    localStorageKey: hankoConfig.cookieName,
  }
  return new Hanko(hankoConfig.apiURL, hankoOptions)
}
