import { defineEventHandler } from 'nuxt/server'

export default defineEventHandler(async (event) => {
  return {
    hanko: event.context.hanko,
  }
})
