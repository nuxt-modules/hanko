import { register } from '@teamhanko/hanko-elements'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const hankoOptions = {
    storageKey: config.public.hanko.cookieName,
  }
  nuxtApp.hook('app:mounted', async () => {
    // register hanko web components
    // see: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    await register(config.public.hanko.apiURL, hankoOptions)
  })
})
