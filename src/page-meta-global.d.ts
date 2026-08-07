/**
 * PageMeta augmentation for the hanko `globalMiddleware` feature.
 * This file must live outside `src/runtime/` because Nuxt automatically
 * includes every module's `dist/runtime` in the app's TypeScript project.
 * If this augmentation were in runtime/, it would always be loaded and
 * `hanko` would appear on PageMeta even when globalMiddleware is false.
 * By living here, it is only loaded when we add it via prepare:types
 * (which we do only when globalMiddleware is true).
 */
type HankoMeta
  = | { allow?: 'all' | 'logged-in' | 'logged-out', deny?: never }
    | { allow?: never, deny?: 'logged-in' | 'logged-out' }

declare module 'nuxt/app' {
  interface PageMeta {
    hanko?: HankoMeta
  }
}

// Required: makes this file a module so `declare module 'nuxt/app'` is treated
// as an augmentation (merge) rather than a new module declaration.
export {}
