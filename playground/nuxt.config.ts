export default defineNuxtConfig({
  modules: ['nuxt-hanko'],
  app: {
    head: {
      bodyAttrs: { class: 'container' },
      link: [{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css' }]
    }
  },
  hanko: {
    apiURL: ''
  },
})
