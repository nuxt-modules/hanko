import type { JWTPayload } from "jose"

export default defineEventHandler(async event => {
  event.context.hanko = await verifyHankoEvent(event).catch((e) => undefined)
})

declare module 'h3' {
  interface H3EventContext {
    hanko?: JWTPayload
  }
}
