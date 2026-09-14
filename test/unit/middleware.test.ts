import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import loggedIn from '../../src/runtime/middleware/logged-in'
import loggedOut from '../../src/runtime/middleware/logged-out'
import { hankoTestState, resetHankoTestState } from '../mocks/imports'

const route = (path: string, query: Record<string, string> = {}) => ({ path, query, fullPath: path }) as unknown as RouteLocationNormalized

function mockHanko({ user }: { user: unknown }) {
  const hanko = {
    getCurrentUser: vi.fn(() => user ? Promise.resolve(user) : Promise.reject(new Error('unauthenticated'))),
    onUserLoggedOut: vi.fn((callback: () => void) => {
      hanko.loggedOutCallback = callback
      return () => {
        hanko.loggedOutCallback = undefined
      }
    }),
    onSessionCreated: vi.fn((callback: () => void) => {
      hanko.sessionCreatedCallback = callback
      return () => {
        hanko.sessionCreatedCallback = undefined
      }
    }),
    loggedOutCallback: undefined as (() => void) | undefined,
    sessionCreatedCallback: undefined as (() => void) | undefined,
  }
  hankoTestState.hanko = hanko
  return hanko
}

const run = (middleware: typeof loggedIn, to: RouteLocationNormalized) => (middleware as (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown)(to, to)

beforeEach(resetHankoTestState)

describe('hanko-logged-in', () => {
  it('redirects unauthenticated users to the login page', async () => {
    mockHanko({ user: null })

    await run(loggedIn, route('/protected'))

    expect(hankoTestState.navigations).toStrictEqual(['/login?redirect=%2Fprotected'])
  })

  it('does not redirect authenticated users', async () => {
    mockHanko({ user: { id: 'user-id' } })

    await run(loggedIn, route('/protected'))

    expect(hankoTestState.navigations).toStrictEqual([])
  })

  it('does not redirect when already on the login page', async () => {
    mockHanko({ user: null })

    await run(loggedIn, route('/login'))

    expect(hankoTestState.navigations).toStrictEqual([])
  })

  it('redirects to the login page when the user logs out', async () => {
    const hanko = mockHanko({ user: { id: 'user-id' } })

    await run(loggedIn, route('/protected'))
    hanko.loggedOutCallback!()

    expect(hankoTestState.navigations).toStrictEqual(['/login?redirect=%2Fprotected'])
  })

  it('removes its hooks when the user navigates away', async () => {
    const hanko = mockHanko({ user: { id: 'user-id' } })

    await run(loggedIn, route('/protected'))
    expect(hankoTestState.routerHooks).toHaveLength(1)

    hankoTestState.routerHooks[0]!()

    expect(hanko.loggedOutCallback).toBeUndefined()
    expect(hankoTestState.routerHooks).toStrictEqual([])
  })
})

describe('hanko-logged-out', () => {
  it('redirects authenticated users to the home page', async () => {
    mockHanko({ user: { id: 'user-id' } })

    await run(loggedOut, route('/login'))

    expect(hankoTestState.navigations).toStrictEqual(['/'])
  })

  it('does not redirect unauthenticated users', async () => {
    mockHanko({ user: null })

    await run(loggedOut, route('/login'))

    expect(hankoTestState.navigations).toStrictEqual([])
  })

  it('follows the redirect query once a session is created', async () => {
    const hanko = mockHanko({ user: null })

    await run(loggedOut, route('/login', { redirect: '/protected' }))
    hanko.sessionCreatedCallback!()

    expect(hankoTestState.navigations).toStrictEqual(['/protected'])
  })

  it('redirects to the success page when there is no redirect query', async () => {
    const hanko = mockHanko({ user: null })

    await run(loggedOut, route('/login'))
    hanko.sessionCreatedCallback!()

    expect(hankoTestState.navigations).toStrictEqual(['/user'])
  })

  it('ignores the redirect query when followRedirect is disabled', async () => {
    hankoTestState.appConfig.hanko.redirects = { login: '/login', home: '/', success: '/user', followRedirect: false }
    const hanko = mockHanko({ user: null })

    await run(loggedOut, route('/login', { redirect: '/protected' }))
    hanko.sessionCreatedCallback!()

    expect(hankoTestState.navigations).toStrictEqual(['/user'])
  })
})
