export default defineNuxtConfig({
  modules: ['nuxt-hanko'],
  hanko: {
    // You need to provide the Hanko API URL in order for it to work
    apiURL: ''
  },
  // Make the app look a bit nicer
  app: {
    head: {
      bodyAttrs: { class: 'container' },
      link: [{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css' }]
    }
  },
})
