// @ts-expect-error `nuxt/server` is only resolvable in Nuxt 5
import { createError, getCookie, getRequestHeader, useRuntimeConfig } from 'nuxt/server'
import { createHankoEventVerifier } from '../../verify'

export interface HankoRequestEvent {
  context: { hanko?: unknown }
}

export const verifyHankoEvent = createHankoEventVerifier<HankoRequestEvent>({
  createError,
  getCookie,
  getRequestHeader,
  useRuntimeConfig,
})
