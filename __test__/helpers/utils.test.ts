import { flatObjectInArr, extend } from '../../src/helpers/utils'

describe('helpers:util', () => {
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
})
