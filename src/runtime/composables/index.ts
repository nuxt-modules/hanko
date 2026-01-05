import { useNuxtApp } from '#app'

/**
 * This composable returns a Hanko instance.
 *
 * It will be `null` on the server but defined on the client.
 */
export function useHanko() {
  if (import.meta.server) {
    return null
  }
  return useNuxtApp().$hanko
}
