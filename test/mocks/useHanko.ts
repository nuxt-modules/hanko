export const useHanko = () => ({
  getCurrentUser: async () => ({ user_id: 'some-user-id', emails: [] }),
  onUserLoggedOut: (_: () => void) => () => {},
  onSessionCreated: (_: () => void) => () => {},
})
