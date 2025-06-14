# Nuxt Hanko

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> [Hanko](https://www.hanko.io/) integration for [Nuxt](https://nuxt.com)

- [✨ &nbsp;Changelog](https://github.com/nuxt-modules/hanko/blob/main/CHANGELOG.md)
<!-- - [▶️ &nbsp;Online playground](https://stackblitz.com/github/nuxt-modules/hanko/tree/main/playground) -->
- [🎁 &nbsp;Hanko starter](https://github.com/teamhanko/hanko-nuxt-starter)

## Features

- ✨ Easy integration for [Hanko](https://www.hanko.io/)
- 🧱 Type safety and auto-registration for Hanko web components
- 💪 Server utilities for full-stack auth

## Installation

Install and add `@nuxtjs/hanko` to your `nuxt.config`.

```bash
npx nuxi@latest module add hanko
```

```js
export default defineNuxtConfig({
  modules: ['@nuxtjs/hanko'],
  hanko: {
    // You can also configure this by setting NUXT_PUBLIC_HANKO_API_URL at runtime
    apiURL: '<YOUR_API_URL>',
    // You can also customise these if required
    // cookieName: 'hanko',
    // cookieSameSite: 'Lax',
    // cookieDomain: 'nuxt.com',
    // storageKey: 'hanko',
    // redirects: {
    //   login: '/login',
    //   success: '/',
    //   home: '/',
    //   followRedirect: true
    // },
    // registerComponents: true,
    // augmentContext: true,
    // components: {
    //   shadow: true,
    //   injectStyles: true,
    //   enablePasskeys: true,
    //   hidePasskeyButtonOnLogin: true,
    //   translations: {},
    //   fallbackLanguage: 'en'
    //   globalMiddleware: false,
    // }
  },
})
```

## Usage

### Components

To use, you can use the Hanko components anywhere in your app: `<hanko-auth>`, `<hanko-events>` and `<hanko-profile>`. These are web components that will be rendered on the client-side only. Props are typed.

You can turn auto-registration of components off (if you wish to use Hanko just on the server side or programmatically) with `registerComponents: false`.

Check out the [Hanko documentation](https://docs.hanko.io/guides/vue) to learn more.

```vue
<template>
  <hanko-auth />
</template>
```

### Middleware

By default two new route middlewares are available in your Nuxt app: `hanko-logged-in` and `hanko-logged-out`.

- `hanko-logged-in` will prevent access to a page unless you are logged in. (It will redirect you to `redirects.login` instead, and then redirect back to this page once you login. You can disable this behaviour by setting `redirects.followRedirect` to `false`.)
- `hanko-logged-out` will prevent access to a page unless you are logged out. (It will redirect you to `redirects.success` when you log in, and otherwise to `redirects.home`.)

You can also create your own middleware for full control.

### Global Middleware

If the `globalMiddleware` configuration is set to `true`, the middleware is automatically applied to all of your pages.
You can still override this behavior on each page, by applying a custom pageMeta.

<!-- TODO document pageMeta -->

**Note**: The `globalMiddleware` option will not apply any authentication checks to your API-paths.

### Auto-imports

`useHanko` is exposed in the Vue part of your app to allow you direct access to the Hanko API. You can access the current user and much more. **Note**: It will return `null` on the server.

The `hankoLoggedIn` and `hankoLoggedOut` middleware are exposed to enable you to extend their functionality, such as creating a custom global middleware.

### Server utilities

By default you can access a verified JWT context on `event.context.hanko`. (It will be undefined if the user is not logged in.) If you want to handle this yourself you can set `augmentContext: false`.

`verifyHankoEvent` is exposed in the Nitro part of your app to expose the underlying utility used to create `event.context.hanko` if you want to handle things manually.

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Stub module with `pnpm dev:prepare`
- Run `pnpm dev` to start [playground](./playground) in development mode

## Credits

Thanks to [@McPizza0](https://github.com/McPizza0) for the push to make the module!

## License

Made with ❤️

Published under the [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/hanko?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/hanko
[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/hanko?style=flat-square
[npm-downloads-href]: https://npm.chart.dev/@nuxtjs/hanko
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/nuxt-modules/hanko/ci.yml?branch=main
[github-actions-href]: https://github.com/nuxt-modules/hanko/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/nuxt-modules/hanko/main?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-modules/hanko
