import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRouter,
  useAppConfig,
  useHanko,
  useRequestEvent,
} from '#imports'

export default defineNuxtRouteMiddleware(async to => {
  const redirects = useAppConfig().hanko.redirects

  if (process.server) {
    const event = useRequestEvent()

    if (!event.context.hanko?.sub && to.path !== redirects.login) {
      return navigateTo(`${redirects.login}?redirect=${to.path}`)
    }
    return
  }

  const hanko = useHanko()!

  if (!(await hanko.user.getCurrent().catch(() => null)) && to.path !== redirects.login) {
    return navigateTo(`${redirects.login}?redirect=${to.path}`)
  }

  const removeHankoHook = hanko.onUserLoggedOut(() => {
    return navigateTo(`${redirects.login}?redirect=${to.path}`)
  })
  const removeRouterHook = useRouter().beforeEach(() => {
    removeHankoHook()
    removeRouterHook()
  })
})
