import { describe, it, expect } from 'vitest'
import type { NuxtPage } from '@nuxt/schema'
import { setupModule, resolvePages } from '../utils/nuxt'

const page = (path: string, meta?: Record<string, unknown>, children?: NuxtPage[]): NuxtPage => ({
  name: path,
  path,
  file: `pages${path}.vue`,
  ...meta ? { meta } : {},
  ...children ? { children } : {},
})

async function guard(pages: NuxtPage[]) {
  const nuxt = await setupModule({ globalMiddleware: true })
  return resolvePages(nuxt, pages)
}

const middlewareOf = (pages: NuxtPage[]) => pages.map(item => item.meta?.middleware)

describe('globalMiddleware', () => {
  it('requires a session on pages without hanko page meta', async () => {
    expect(middlewareOf(await guard([page('/about')]))).toStrictEqual([['hanko-logged-in']])
  })

  it('leaves allow: all pages unguarded', async () => {
    expect(middlewareOf(await guard([page('/public', { hanko: { allow: 'all' } })]))).toStrictEqual([undefined])
  })

  it.each([{ allow: 'logged-in' }, { deny: 'logged-out' }])('requires a session for %o', async (hanko) => {
    expect(middlewareOf(await guard([page('/page', { hanko })]))).toStrictEqual([['hanko-logged-in']])
  })

  it.each([{ allow: 'logged-out' }, { deny: 'logged-in' }])('requires no session for %o', async (hanko) => {
    expect(middlewareOf(await guard([page('/page', { hanko })]))).toStrictEqual([['hanko-logged-out']])
  })

  it.each([{}, { allow: 'nonsense' }])('requires a session for unrecognised page meta %o', async (hanko) => {
    expect(middlewareOf(await guard([page('/page', { hanko })]))).toStrictEqual([['hanko-logged-in']])
  })

  it.each(['hanko-logged-in', 'hanko-logged-out'])('keeps an explicit %s', async (middleware) => {
    const pages = await guard([page('/page', { middleware: [middleware] })])

    expect(middlewareOf(pages)).toStrictEqual([[middleware]])
  })

  it('keeps unrelated middleware alongside the guard', async () => {
    const pages = await guard([page('/page', { middleware: 'analytics' })])

    expect(middlewareOf(pages)).toStrictEqual([['analytics', 'hanko-logged-in']])
  })

  it('guards nested pages', async () => {
    const children = [page('/parent/child'), page('/parent/public', { hanko: { allow: 'all' } })]
    const [parent] = await guard([page('/parent', undefined, children)])

    expect(parent!.meta?.middleware).toStrictEqual(['hanko-logged-in'])
    expect(middlewareOf(parent!.children!)).toStrictEqual([['hanko-logged-in'], undefined])
  })

  it('ignores routes without a page component', async () => {
    const pages = await guard([{ name: 'redirect', path: '/old', redirect: '/new' }])

    expect(middlewareOf(pages)).toStrictEqual([undefined])
  })
})
