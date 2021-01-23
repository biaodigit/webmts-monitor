import {
  supportPerformance,
  supportPerformanceObserver,
  supportMutationObserver,
  now,
  flatObjectInArr,
  extend,
  calculateAreaPrecent,
} from '../../src/helpers/utils'
import mock from '../mock'

describe('helpers:util', () => {
  beforeEach(() => {
    mock.performance()
    ;(window as any).chrome = {}
    ;(window as any).PerformanceObserver = mock.PerformanceObserver
    ;(window as any).MutationObserver = mock.MutationObserver
    ;(window as any).innerWidth = 700
    ;(window as any).innerHeight = 700
  })
  describe('support', () => {
    test('support performance', () => {
      expect(supportPerformance()).toBeTruthy()
    })
    test('support performanceOb', () => {
      expect(supportPerformanceObserver()).toBeTruthy()
    })
    test('support mutationOb', () => {
      expect(supportMutationObserver()).toBeTruthy()
    })
  })
  describe('now', () => {
    test('should be mutable', () => {
      expect(typeof now()).toBe('number')
    })
  })
  describe('flatObjectInArr', () => {
    test('should be empty', () => {
      expect(flatObjectInArr({})).toEqual({})
    })
    test('should be merge properties', () => {
      const a = [{ fcp: 111 }, { fmp: 222 }, { tti: 333 }]
      const b = flatObjectInArr(a)
      expect(b).toEqual({ fcp: 111, fmp: 222, tti: 333 })
    })
  })
  describe('extend', () => {
    test('should be mutable', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)
      expect(a.foo).toBe(123)
    })
    test('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })
  })
  describe('calculateAreaPrecent', () => {
    test('should be element is not beyond area', () => {
      const target = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 100,
          bottom: 500,
          right: 500,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(1)
    })
    test('should be element is beyond left area',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: 100,
          left: -50,
          bottom: 500,
          right: 650,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.5)
    })
    test('should be element is beyond left top area',()=>{
      const target = {
        getBoundingClientRect: () => ({
          top: -50,
          left: -50,
          bottom: 650,
          right: 650,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.25)
    })
    test('should be element is beyond top area',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: -50,
          left: 100,
          bottom: 650,
          right: 600,
          height: 100,
          width: 100,
        })
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.5)
    })
    test('should be element is beyond right area',()=>{
      const target = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 650,
          bottom: 650,
          right: -50,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.5)
    })
    test('should be element is beyond right top area',()=>{
      const target = {
        getBoundingClientRect: () => ({
          top: -50,
          left: 650,
          bottom: 650,
          right: -50,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.25)
    })
    test('should be element is beyond rigth bottom area',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: 650,
          left: 650,
          bottom: -50,
          right: -50,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.25)
    })
    test('should be element is beyond bottom area',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: 650,
          left: 600,
          bottom: -50,
          right: 100,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.5)
    })
    test('should be element is beyond left bottom area',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: 650,
          left: -50,
          bottom: -50,
          right: 650,
          height: 100,
          width: 100,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0.25)
    })
    test('should be element witdh be none',() => {
      const target = {
        getBoundingClientRect: () => ({
          top: 650,
          left: -50,
          bottom: -50,
          right: 650,
          height: 100,
          width: 0,
        }),
      } as Element
      expect(calculateAreaPrecent(target)).toBe(0)
    })
  })
})
