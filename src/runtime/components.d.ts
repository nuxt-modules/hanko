import type { DefineComponent } from 'vue'

declare module 'vue' {
  interface GlobalComponents {
    HankoAuth: DefineComponent<{
      /**
       * Currently supported values are "en" for English and "de" for German.
       * If the value is omitted, "en" is used.
       */
      lang?: 'en' | 'de' | (string & {})
      /** A space-separated list of experimental features to be enabled. See experimental features. */
      experimental?: string
    }>
    HankoProfile: DefineComponent<{
      /**
       * Currently supported values are "en" for English and "de" for German.
       * If the value is omitted, "en" is used.
       */
      lang?: 'en' | 'de' | (string & {})
    }>
    HankoEvents: DefineComponent<Record<string, unknown>>
  }
}

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
