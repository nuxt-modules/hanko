import type { DefineComponent } from 'vue'

/**
 * Language to use for the component's UI.
 *
 * Currently supported values are "bn", "de", "en", "fr", "it", "pt-BR" and "zh".
 * If the value is omitted, "en" is used.
 */
type HankoLang = 'bn' | 'de' | 'en' | 'fr' | 'it' | 'pt-BR' | 'zh' | (string & {})

interface HankoAuthProps {
  'lang'?: HankoLang
  /** Email address to prefill the email input with. */
  'prefilled-email'?: string
  /** Which flow `<hanko-auth>` starts in. Ignored by `<hanko-login>` and `<hanko-registration>`. */
  'mode'?: 'login' | 'registration'
}

declare module 'vue' {
  interface GlobalComponents {
    HankoAuth: DefineComponent<HankoAuthProps>
    HankoLogin: DefineComponent<HankoAuthProps>
    HankoRegistration: DefineComponent<HankoAuthProps>
    HankoProfile: DefineComponent<{
      lang?: HankoLang
    }>
    HankoEvents: DefineComponent<Record<string, unknown>>
  }
}
