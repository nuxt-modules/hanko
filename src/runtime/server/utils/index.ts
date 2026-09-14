import type { H3Event } from 'h3'
import { createError, getCookie, getHeader } from 'h3'
import { createHankoEventVerifier } from '../../verify'
import { useRuntimeConfig } from '#imports'

export const verifyHankoEvent = createHankoEventVerifier<H3Event>({
  createError,
  getCookie,
  getRequestHeader: getHeader,
  useRuntimeConfig,
})
