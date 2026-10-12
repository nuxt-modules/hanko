import { createError, getCookie, getRequestHeader, useRuntimeConfig } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'
import { createHankoEventVerifier } from '../../verify'

export const verifyHankoEvent = createHankoEventVerifier<Pick<RequestEvent, 'req'>>({
  createError,
  getCookie,
  getRequestHeader,
  useRuntimeConfig,
})
