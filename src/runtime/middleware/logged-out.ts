import {
  defineNuxtRouteMiddleware,
  navigateTo,
  onBeforeRouteLeave,
  useAppConfig,
  useHanko,
  useRequestEvent,
} from '#imports'

export default defineNuxtRouteMiddleware(async to => {
  const redirects = useAppConfig().hanko.redirects

  if (process.server) {
    const event = useRequestEvent()

    if (event.context.hanko?.sub && to.path !== redirects.home) {
      return navigateTo(redirects.home)
    }
    return
  }

  const hanko = useHanko()

  if ((await hanko.user.getCurrent().catch(() => null)) && to.path !== redirects.home) {
    return navigateTo(redirects.home)
  }

  const unsubscribe = hanko.onAuthFlowCompleted(() => {
    navigateTo(redirects.success)
  })
  onBeforeRouteLeave(() => {
    unsubscribe()
  })
})
