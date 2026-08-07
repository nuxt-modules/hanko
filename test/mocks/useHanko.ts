export const useHanko = () => ({
  user: {
    getCurrent: async () => ({ id: 'some-user-id', webauthn_credentials: [] }),
  },
  onUserLoggedOut: (_: () => void) => {},
})
