import { H3Event, getHeader } from 'h3'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { useRuntimeConfig } from '#imports'

export async function verifyHankoEvent(event: H3Event) {
  const jwksHost = useRuntimeConfig().public.hanko.apiURL
  const JWKS = createRemoteJWKSet(new URL(`${jwksHost}/.well-known/jwks.json`))

  const jwt = getHeader(event, 'authorization')?.split(' ').pop() || getCookie(event, 'hanko')

  if (!jwt) {
    throw createError({
      statusCode: 401,
    })
  }

  return await jwtVerify(jwt, JWKS).then(r => r.payload)
}
