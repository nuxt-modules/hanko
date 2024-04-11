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
    const event = useRequestEvent()!

    if (event.context.hanko?.sub && to.path !== redirects.home) {
      return navigateTo(redirects.home)
    }
    return
  }

  const hanko = useHanko()!

  if ((await hanko.user.getCurrent().catch(() => null)) && to.path !== redirects.home) {
    return navigateTo(redirects.home)
  }

  const removeHankoHook = hanko.onAuthFlowCompleted(() => {
    if (!redirects.followRedirect || !to.query.redirect) {
      navigateTo(redirects.success)
      return
    }
    navigateTo(to.query.redirect as string)
  })
  const removeRouterHook = useRouter().beforeEach(() => {
    removeHankoHook()
    removeRouterHook()
  })
})
