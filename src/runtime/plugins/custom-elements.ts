import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const isCustomElement = nuxtApp.vueApp.config.compilerOptions.isCustomElement
  nuxtApp.vueApp.config.compilerOptions.isCustomElement = (tag: string) =>
    tag.startsWith('hanko-') || isCustomElement?.(tag) || false
})
