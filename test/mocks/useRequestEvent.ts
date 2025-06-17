import type { H3EventContext } from 'h3'

export const useRequestEvent = () => ({
  context: {
    hanko: {
      aud: [],
      email: {
        address: 'mail@example.com',
        is_primary: true,
        is_verified: true,
      },
      exp: 0,
      iat: 0,
      sub: 'some-user-id',
    },
  } satisfies H3EventContext,
})
