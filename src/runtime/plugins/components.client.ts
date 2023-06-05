import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { register } from '@teamhanko/hanko-elements'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  nuxtApp.hook('app:mounted', async () => {
    // register hanko web components
    // see: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    await register(config.public.hanko.apiURL)
  })
})
