declare module 'nuxt/app' {
  interface PageMeta {
    hanko?:
      | {
        allow?: 'all' | 'logged-in' | 'logged-out'
        deny?: never
      }
      | {
        allow?: never
        deny?: 'logged-in' | 'logged-out'
      }
  }
}
