import { register } from '@teamhanko/hanko-elements'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const hankoOptions = {
    storageKey: config.public.hanko.cookieName,
    cookieSameSite: config.public.hanko.cookieSameSite,
    cookieDomain: config.public.hanko.cookieDomain,
    shadow: config.public.hanko.shadow,
    injectStyles: config.public.hanko.injectStyles,
    enablePasskeys: config.public.hanko.enablePasskeys,
    hidePasskeyButtonOnLogin: config.public.hanko.hidePasskeyButtonOnLogin,
    translations: config.public.hanko.translations,
    translationsLocation: config.public.hanko.translationsLocation,
    fallbackLanguage: config.public.hanko.fallbackLanguage,
  }
  nuxtApp.hook('app:mounted', async () => {
    // register hanko web components
    // see: https://github.com/teamhanko/hanko/blob/main/frontend/elements/README.md#script
    await register(config.public.hanko.apiURL, hankoOptions)
  })
})
