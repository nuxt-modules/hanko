import type { RouteLocationNormalized } from 'vue-router'

type Middleware = (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown
type Plugin = (nuxtApp: Record<string, unknown>) => unknown

export const hankoTestState = {
  runtimeConfig: { public: { hanko: {} as Record<string, unknown> } },
  appConfig: { hanko: { redirects: {} as Record<string, unknown> } },
  hanko: null as Record<string, unknown> | null,
  nuxtApp: {} as Record<string, unknown>,
  requestEvent: { context: {} as Record<string, unknown> },
  navigations: [] as unknown[],
  routerHooks: [] as Array<() => void>,
}

export function resetHankoTestState() {
  hankoTestState.runtimeConfig = { public: { hanko: { apiURL: 'https://hanko.example.com', cookieName: 'hanko' } } }
  hankoTestState.appConfig = { hanko: { redirects: { login: '/login', home: '/', success: '/user', followRedirect: true } } }
  hankoTestState.hanko = null
  hankoTestState.nuxtApp = {}
  hankoTestState.requestEvent = { context: {} }
  hankoTestState.navigations = []
  hankoTestState.routerHooks = []
}

resetHankoTestState()

export const useRuntimeConfig = () => hankoTestState.runtimeConfig
export const useAppConfig = () => hankoTestState.appConfig
export const useHanko = () => hankoTestState.hanko
export const useNuxtApp = () => hankoTestState.nuxtApp
export const useRequestEvent = () => hankoTestState.requestEvent

export const defineNuxtRouteMiddleware = (middleware: Middleware) => middleware
export const defineNuxtPlugin = (plugin: Plugin) => plugin

export function navigateTo(to: unknown) {
  hankoTestState.navigations.push(to)
  return to
}

export function useRouter() {
  return {
    beforeEach(hook: () => void) {
      hankoTestState.routerHooks.push(hook)
      return () => {
        hankoTestState.routerHooks = hankoTestState.routerHooks.filter(item => item !== hook)
      }
    },
  }
}
