import type { JWTPayload } from 'jose'
import { defineEventHandler } from 'h3'
import { verifyHankoEvent } from '../utils/index'

export default defineEventHandler(async event => {
  event.context.hanko = await verifyHankoEvent(event).catch(() => undefined)
})

declare module 'h3' {
  interface H3EventContext {
    hanko?: JWTPayload
  }
}
