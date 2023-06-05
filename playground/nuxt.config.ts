export default defineNuxtConfig({
  modules: ['../src/module'],
  hanko: {
    apiURL: ''
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("hanko-")
    }
  }
})
