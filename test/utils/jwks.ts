import { createServer } from 'node:http'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { SignJWT, exportJWK, generateKeyPair } from 'jose'
import type { CryptoKey } from 'jose'

export interface JwksFixture {
  /** Origin of the JWKS server, suitable for use as the Hanko `apiURL`. */
  url: string
  sign: (payload?: Record<string, unknown>, options?: { expiresIn?: string | number }) => Promise<string>
  /** A token signed by a key that is not published on the JWKS endpoint. */
  signWithForeignKey: (payload?: Record<string, unknown>) => Promise<string>
  close: () => Promise<void>
}

const alg = 'RS256'
const kid = 'test-key'

export async function createJwksServer(): Promise<JwksFixture> {
  const { publicKey, privateKey } = await generateKeyPair(alg, { extractable: true })
  const foreign = await generateKeyPair(alg, { extractable: true })

  const jwks = {
    keys: [{ ...(await exportJWK(publicKey)), alg, kid, use: 'sig' }],
  }

  const server: Server = createServer((req, res) => {
    if (req.url === '/.well-known/jwks.json') {
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(jwks))
      return
    }
    res.statusCode = 404
    res.end()
  })

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo

  const signWith = async (key: CryptoKey, payload: Record<string, unknown>, expiresIn: string | number) =>
    new SignJWT({
      email: { address: 'test@example.com', is_primary: true, is_verified: true },
      ...payload,
    })
      .setProtectedHeader({ alg, kid })
      .setSubject((payload.sub as string) ?? 'test-user')
      .setAudience((payload.aud as string[]) ?? ['localhost'])
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key)

  return {
    url: `http://127.0.0.1:${port}`,
    sign: (payload = {}, options = {}) => signWith(privateKey, payload, options.expiresIn ?? '1h'),
    signWithForeignKey: (payload = {}) => signWith(foreign.privateKey, payload, '1h'),
    close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
  }
}
