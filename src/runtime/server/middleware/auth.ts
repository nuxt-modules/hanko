import type { JWTPayload } from "jose"
import { defineEventHandler, verifyHankoEvent } from '#imports'

export default defineEventHandler(async event => {
  event.context.hanko = await verifyHankoEvent(event).catch(() => undefined)
})

declare module 'h3' {
  interface H3EventContext {
    hanko?: JWTPayload
  }
}
