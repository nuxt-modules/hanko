import { withQuery } from 'ufo'
import { defineNuxtRouteMiddleware, navigateTo, useRouter, useAppConfig, useHanko, useRequestEvent } from '#imports'
import type { RouteMiddleware } from 'nuxt/app'

export const hankoLoggedIn = (async (to, _) => {
  const redirects = useAppConfig().hanko.redirects

  if (import.meta.server) {
    const event = useRequestEvent()!

    if (!event.context.hanko?.sub && to.path !== redirects.login) {
      return navigateTo(withQuery(redirects.login, { redirect: to.path }))
    }
    return
  }

  const hanko = useHanko()!

  if (!(await hanko.user.getCurrent().catch(() => null)) && to.path !== redirects.login) {
    return navigateTo(withQuery(redirects.login, { redirect: to.path }))
  }

  const removeHankoHook = hanko.onUserLoggedOut(() => {
    return navigateTo(withQuery(redirects.login, { redirect: to.path }))
  })
  const removeRouterHook = useRouter().beforeEach(() => {
    removeHankoHook()
    removeRouterHook()
  })
}) satisfies RouteMiddleware

export default defineNuxtRouteMiddleware(hankoLoggedIn)
