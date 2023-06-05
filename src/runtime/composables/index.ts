import { useRuntimeConfig } from '#imports'
import { Hanko } from '@teamhanko/hanko-elements'

export function useHanko() {
  if (process.server) {
    return null as unknown as Hanko
  }

  const hankoApi = useRuntimeConfig().public.hanko.apiURL
  return new Hanko(hankoApi)
}
