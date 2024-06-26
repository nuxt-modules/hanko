import type { H3Event } from 'h3'
import { createError, getCookie, getHeader } from 'h3'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import type { HankoPayload } from '../../auth'
import { useRuntimeConfig } from '#imports'

export async function verifyHankoEvent(event: H3Event) {
  const hankoConfig = useRuntimeConfig().public.hanko
  const jwksHost = hankoConfig.apiURL
  const JWKS = createRemoteJWKSet(new URL(`${jwksHost}/.well-known/jwks.json`))

  const cookieName = hankoConfig.cookieName
  const jwt = getHeader(event, 'authorization')?.split(' ').pop() || getCookie(event, cookieName)

  if (!jwt) {
    throw createError({
      statusCode: 401,
    })
  }

  return await jwtVerify<HankoPayload>(jwt, JWKS).then(r => r.payload)
}
