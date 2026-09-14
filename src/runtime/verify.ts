import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { HankoPayload } from './auth'

export interface HankoServerHelpers<Event> {
  createError: (input: { statusCode: number }) => Error
  getCookie: (event: Event, name: string) => string | undefined
  getRequestHeader: (event: Event, name: string) => string | undefined
  useRuntimeConfig: () => { public: { hanko: { apiURL: string, cookieName: string } } }
}

export function createHankoEventVerifier<Event>(helpers: HankoServerHelpers<Event>) {
  return async function verifyHankoEvent(event: Event) {
    const hankoConfig = helpers.useRuntimeConfig().public.hanko
    const JWKS = createRemoteJWKSet(new URL(`${hankoConfig.apiURL}/.well-known/jwks.json`))

    const jwt = helpers.getRequestHeader(event, 'authorization')?.split(' ').pop()
      || helpers.getCookie(event, hankoConfig.cookieName)

    if (!jwt) {
      throw helpers.createError({ statusCode: 401 })
    }

    return await jwtVerify<HankoPayload>(jwt, JWKS).then(r => r.payload)
  }
}
