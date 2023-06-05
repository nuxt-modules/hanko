import type { JWTPayload } from 'jose'

declare module 'h3' {
  interface H3EventContext {
    hanko?: JWTPayload
  }
}
