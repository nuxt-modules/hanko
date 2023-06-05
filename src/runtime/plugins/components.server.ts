import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.compilerOptions.isCustomElement = tag => tag.startsWith('hanko-')
})
