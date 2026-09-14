import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createEvent } from 'h3'
import { verifyHankoEvent } from '../../src/runtime/server/utils/index'
import { hankoTestState } from '../mocks/imports'
import { createJwksServer } from '../utils/jwks'
import type { JwksFixture } from '../utils/jwks'

let jwks: JwksFixture

const setConfig = (hanko: { apiURL: string, cookieName: string }) => {
  hankoTestState.runtimeConfig = { public: { hanko } }
}

beforeAll(async () => {
  jwks = await createJwksServer()
  setConfig({ apiURL: jwks.url, cookieName: 'hanko' })
})

afterAll(() => jwks.close())

function eventWithHeaders(headers: Record<string, string>) {
  const req = new IncomingMessage(new Socket())
  Object.assign(req.headers, headers)
  return createEvent(req, new ServerResponse(req))
}

describe('verifyHankoEvent', () => {
  it('verifies a token passed as a cookie', async () => {
    const jwt = await jwks.sign({ sub: 'cookie-user' })
    const payload = await verifyHankoEvent(eventWithHeaders({ cookie: `hanko=${jwt}` }))

    expect(payload.sub).toBe('cookie-user')
    expect(payload.email.address).toBe('test@example.com')
  })

  it('verifies a token passed as a bearer header', async () => {
    const jwt = await jwks.sign({ sub: 'header-user' })
    const payload = await verifyHankoEvent(eventWithHeaders({ authorization: `Bearer ${jwt}` }))

    expect(payload.sub).toBe('header-user')
  })

  it('prefers the authorization header over the cookie', async () => {
    const [header, cookie] = await Promise.all([jwks.sign({ sub: 'header-user' }), jwks.sign({ sub: 'cookie-user' })])
    const payload = await verifyHankoEvent(eventWithHeaders({
      authorization: `Bearer ${header}`,
      cookie: `hanko=${cookie}`,
    }))

    expect(payload.sub).toBe('header-user')
  })

  it('reads the cookie name from runtime config', async () => {
    setConfig({ apiURL: jwks.url, cookieName: 'custom-cookie' })
    const jwt = await jwks.sign({ sub: 'custom-cookie-user' })

    await expect(verifyHankoEvent(eventWithHeaders({ cookie: `hanko=${jwt}` }))).rejects.toMatchObject({ statusCode: 401 })
    await expect(verifyHankoEvent(eventWithHeaders({ cookie: `custom-cookie=${jwt}` }))).resolves.toMatchObject({ sub: 'custom-cookie-user' })

    setConfig({ apiURL: jwks.url, cookieName: 'hanko' })
  })

  it('throws a 401 when no token is present', async () => {
    await expect(verifyHankoEvent(eventWithHeaders({}))).rejects.toMatchObject({ statusCode: 401 })
  })

  it('rejects a token signed by an unknown key', async () => {
    const jwt = await jwks.signWithForeignKey()

    await expect(verifyHankoEvent(eventWithHeaders({ cookie: `hanko=${jwt}` }))).rejects.toThrow()
  })

  it('rejects an expired token', async () => {
    const jwt = await jwks.sign({ sub: 'expired-user' }, { expiresIn: '-1h' })

    await expect(verifyHankoEvent(eventWithHeaders({ cookie: `hanko=${jwt}` }))).rejects.toThrow(/exp/)
  })

  it('rejects a malformed token', async () => {
    await expect(verifyHankoEvent(eventWithHeaders({ cookie: 'hanko=not-a-jwt' }))).rejects.toThrow()
  })
})
