import { defineEventHandler } from 'nuxt/server'
import { verifyHankoEvent } from '../utils/index'

export default defineEventHandler(async (event) => {
  event.context.hanko = await verifyHankoEvent(event).catch(() => undefined)
})
