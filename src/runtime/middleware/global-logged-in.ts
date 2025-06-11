import { defineNuxtRouteMiddleware, hankoLoggedIn } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // If the requested location doesn't exist: let the router handle it
  if (to.matched.length === 0) return true

  // Don't trigger on client-side navigation on the same-page
  // (changes in to.query or to.hash)
  if (import.meta.client && to.path === from.path) return true

  // If a hanko middleware is explicitly set, that middleware handles
  // navigation and the default hankoLoggedIn is skipped
  if ([to.meta.middleware].flat().some(isHankoMiddleware)) return true

  // If no hanko middleware is set, default to hankoLoggedIn
  return await hankoLoggedIn(to, from)
})

/**
 * Checks if the given middleware is a valid Hanko middleware.
 *
 * @param middleware - The middleware to check.
 * @description If middleware is undefined or a NavigationGuard (function), it
 * is not a Hanko middleware. A valid Hanko middleware is a MiddlewareKey
 * (string) with one of the following values:
 * - `hanko-logged-in`
 * - `hanko-logged-out`
 * - `hanko-allow-all`
 */
const isHankoMiddleware = (middleware: unknown) => {
  return (
    typeof middleware === 'string' &&
    [
      'hanko-allow-all',
      'hanko-logged-in',
      'hanko-logged-out',
    ].includes(middleware)
  )
}
