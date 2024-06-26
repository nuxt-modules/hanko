import type { JWTPayload } from 'jose'

export type HankoPayload = JWTPayload & {
  aud: string[]
  email: {
    address: string
    is_primary: boolean
    is_verified: boolean
  }
  exp: number
  iat: number
  sub: string
}

declare module 'h3' {
  interface H3EventContext {
    hanko?: HankoPayload
  }
}
