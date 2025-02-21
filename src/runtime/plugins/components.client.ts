import { register } from '@teamhanko/hanko-elements'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  nuxtApp.hook('app:mounted', async () => {
    // register hanko web components
    // see: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    await register(config.public.hanko.apiURL, {
      storageKey: config.public.hanko.storageKey,
      cookieSameSite: config.public.hanko.cookieSameSite,
      cookieDomain: config.public.hanko.cookieDomain,
      ...config.public.hanko.components,
    })
  })
})
