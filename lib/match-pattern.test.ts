import { expect, test } from 'vitest'
import { MatchPattern } from './match-pattern'

test('all urls', () => {
  const p = new MatchPattern("*")
  expect(p.includes("chrome://version")).toBe(true)
  expect(p.includes("https://www.google.com")).toBe(true)
})

test('protocol=*', () => {
  const p = new MatchPattern('*://google.com')
  expect(p.includes('http://google.com')).toBe(true)
  expect(p.includes('https://google.com')).toBe(true)
  expect(p.includes('chrome://google.com')).toBe(true)
})

test('protocol=https', () => {
  const p = new MatchPattern('https://google.com')
  expect(p.includes('https://google.com')).toBe(true)
  expect(p.includes('http://google.com')).toBe(false)
})

test('host *', () => {
  const p1 = new MatchPattern('https://*.google.com')
  expect(p1.includes('https://gmail.google.com')).toBe(true)
  expect(p1.includes('https://docs.google.com')).toBe(true)
  expect(p1.includes('https://docs.google.com/')).toBe(false)

  const p2 = new MatchPattern('chrome://*')
  expect(p2.includes('chrome://version')).toBe(true)
})

test('path *', () => {
  const p = new MatchPattern('https://www.google.com/abc/*')
  expect(p.includes('https://www.google.com/abc/')).toBe(true)
  expect(p.includes('https://www.google.com/abc/?a=1&b=2#c')).toBe(true)
  expect(p.includes('https://www.google.com/def/')).toBe(false)
})

test('many *', () => {
  const p = new MatchPattern('*://*.google.com/*')
  expect(p.includes('https://www.google.com/')).toBe(true)
  expect(p.includes('http://doc.google.com/')).toBe(true)
  expect(p.includes('https://www.google.com/abc?a=1&b=2#c')).toBe(true)
})
