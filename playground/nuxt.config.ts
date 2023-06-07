export default defineNuxtConfig({
  modules: ['nuxt-hanko'],
  hanko: {
    // You need to provide the Hanko API URL in order for it to work
    apiURL: '',
    redirects: {
      login: '/login', // this is the default
      home: '/', // this is the default
      success: '/user', // this is a custom redirect
      followRedirect: true, // this can be set to false to always redirect to the success page
    },
  },
  // Make the app look a bit nicer
  app: {
    head: {
      bodyAttrs: { class: 'container' },
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css',
        },
      ],
    },
  },
})
