# Nuxt Hanko

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> [Hanko](https://www.hanko.io/) integration for [Nuxt](https://nuxt.com)

- [✨ &nbsp;Changelog](https://github.com/danielroe/nuxt-hanko/blob/main/CHANGELOG.md)
<!-- - [▶️ &nbsp;Online playground](https://stackblitz.com/github/danielroe/nuxt-hanko/tree/main/playground) -->

## Features

- ✨ Easy integration for [Hanko](https://www.hanko.io/)
- 🧱 Type safety and auto-registration for Hanko web components
- 💪 Server utilities for full-stack auth

## Installation

Install and add `nuxt-hanko` to your `nuxt.config`.

```bash
# Whichever matches your package manager
pnpm add -D nuxt-hanko
npm install -D nuxt-hanko
yarn add -D nuxt-hanko
```

```js
export default defineNuxtConfig({
  modules: ['nuxt-hanko'],
  hanko: {
    // You can also configure this by setting NUXT_PUBLIC_HANKO_API_URL at runtime
    apiURL: '<YOUR_API_URL>',
    // You can also customise these if required
    // redirects: {
    //   login: '/login',
    //   success: '/',
    //   home: '/',
    //   followRedirect: true //automatically redirects unauthed users back to prefious page after authenticating
    // },
    // registerComponents: true,
    // augmentContext: true,
    // cookieName: 'hanko'
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

By default two new route middleware are available in your Nuxt app: `hanko-logged-in` and `hanko-logged-out`.

- `hanko-logged-in` will prevent access to a page unless you are logged in. (It will redirect you to `redirects.login` instead.)
- `hanko-logged-out` will prevent access to a page unless you are logged out. (It will redirect you to `redirects.success` when you log in, and otherwise to `redirects.home`.)

You can also create your own middleware for full control.

### Auto-imports

`useHanko` is exposed in the Vue part of your app to allow you direct access to the Hanko API. You can access the current user and much more. **Note**: It will return `null` on the server.

### Server utilities

By default you can access a verified JWT context on `event.context.hanko`. (It will be undefined if the user is not logged in.) If you want to handle this yourself you can set `augmentContext: false`.

`verifyHankoEvent` is exposed in the Nitro part of your app to expose the underlying utility used to create `event.context.hanko` if you want to handle things manually.

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Stub module with `pnpm dev:prepare`
- Run `pnpm dev` to start [playground](./playground) in development mode

## Credits

Thanks to [@McPizza0](https://github.com/McPizza0) for the push to make the module!

## License

Made with ❤️

Published under the [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-hanko?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-hanko
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-hanko?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-hanko
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/danielroe/nuxt-hanko/ci.yml?branch=main
[github-actions-href]: https://github.com/danielroe/nuxt-hanko/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/danielroe/nuxt-hanko/main?style=flat-square
[codecov-href]: https://codecov.io/gh/danielroe/nuxt-hanko
