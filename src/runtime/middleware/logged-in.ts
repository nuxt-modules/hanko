import { withQuery } from 'ufo'
import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRouter,
  useAppConfig,
  useHanko,
  useRequestEvent,
} from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const redirects = useAppConfig().hanko.redirects

  if (import.meta.server) {
    const event = useRequestEvent()

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
})
