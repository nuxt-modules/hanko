import type { DefineComponent } from 'vue'

declare module 'vue' {
  interface GlobalComponents {
    HankoAuth: DefineComponent<{
      /**
       * Currently supported values are "en" for English and "de" for German.
       * If the value is omitted, "en" is used.
       */
      lang?: 'bn' | 'de' | 'en' | 'fr' | 'it' | 'pt-BR' | 'zh' | (string & {})
      /** A space-separated list of experimental features to be enabled. See experimental features. */
      experimental?: string
    }>
    HankoProfile: DefineComponent<{
      /**
       * Currently supported values are "en" for English and "de" for German.
       * If the value is omitted, "en" is used.
       */
      lang?: 'bn' | 'de' | 'en' | 'fr' | 'it' | 'pt-BR' | 'zh' | (string & {})
    }>
    HankoEvents: DefineComponent<Record<string, unknown>>
  }
}
