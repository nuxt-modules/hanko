// @ts-expect-error `nuxt/server` is only resolvable in Nuxt 5
import { defineEventHandler } from 'nuxt/server'
import { verifyHankoEvent } from '../utils/index'
import type { HankoRequestEvent } from '../utils/index'

export default defineEventHandler(async (event: HankoRequestEvent) => {
  event.context.hanko = await verifyHankoEvent(event).catch(() => undefined)
})
