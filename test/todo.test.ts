import { describe, test } from 'vitest'

describe('Without globalMiddleware', () => {
  describe('loggedIn', () => {
    describe('ssr', () => {
      test.todo('middleware:none')
      test.todo('middleware:loggedIn')
      test.todo('middleware:loggedOut')
    })
    describe('client', () => {
      test.todo('middleware:none')
      test.todo('middleware:loggedIn')
      test.todo('middleware:loggedOut')
    })
  })

  test.todo('pageMeta has no effect')
})

describe('With globalMiddleware', () => {
  describe('loggedOut', () => {
    describe('ssr', () => {
      describe('middleware', () => {
        test.todo('none')
        test.todo('loggedIn')
        test.todo('loggedOut')
      })

      describe('pageMeta', () => {
        test.todo('allow:all')
        test.todo('allow:logged-in')
        test.todo('allow:logged-out')
        test.todo('deny:logged-in')
        test.todo('deny:logged-out')
      })
    })

    describe('client', () => {
      describe('middleware', () => {
        test.todo('none')
        test.todo('loggedIn')
        test.todo('loggedOut')
      })

      describe('pageMeta', () => {
        test.todo('allow:all')
        test.todo('allow:logged-in')
        test.todo('allow:logged-out')
        test.todo('deny:logged-in')
        test.todo('deny:logged-out')
      })
    })
  })

  describe('loggedIn', () => {
    describe('ssr', () => {
      describe('middleware', () => {
        test.todo('none')
        test.todo('loggedIn')
        test.todo('loggedOut')
      })

      describe('pageMeta', () => {
        test.todo('allow:all')
        test.todo('allow:logged-in')
        test.todo('allow:logged-out')
        test.todo('deny:logged-in')
        test.todo('deny:logged-out')
      })
    })

    describe('client', () => {
      describe('middleware', () => {
        test.todo('none')
        test.todo('loggedIn')
        test.todo('loggedOut')
      })

      describe('pageMeta', () => {
        test.todo('allow:all')
        test.todo('allow:logged-in')
        test.todo('allow:logged-out')
        test.todo('deny:logged-in')
        test.todo('deny:logged-out')
      })
    })
  })

  test.todo('middleware trumps pageMeta')
})
