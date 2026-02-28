export type HankoMeta
  = | { allow?: 'all' | 'logged-in' | 'logged-out', deny?: never }
    | { allow?: never, deny?: 'logged-in' | 'logged-out' }

declare module 'nuxt/app' {
  interface PageMeta {
    hanko?: HankoMeta
  }
}
