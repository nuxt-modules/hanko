import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { register } from '@teamhanko/hanko-elements'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.compilerOptions.isCustomElement = tag => tag.startsWith('hanko-')

  const config = useRuntimeConfig()

  nuxtApp.hook('app:mounted', async () => {
    // register hanko web components
    // see: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    await register(config.public.hanko.apiURL)
  })
})
