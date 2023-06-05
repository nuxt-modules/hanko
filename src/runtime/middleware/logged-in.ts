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

    if (!event.context.hanko?.sub && to.path !== redirects.login) {
      return navigateTo(redirects.login)
    }
    return
  }

  const hanko = useHanko()

  if (!(await hanko.user.getCurrent().catch(() => null)) && to.path !== redirects.login) {
    return navigateTo(redirects.login)
  }

  const unsubscribe = hanko.onUserLoggedOut(() => {
    navigateTo(redirects.login)
  })
  onBeforeRouteLeave(() => {
    unsubscribe()
  })
})
