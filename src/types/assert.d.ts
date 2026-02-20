declare module 'node:assert' {
  function assert(value: unknown, message?: string): void
  namespace assert {
    function equal(actual: unknown, expected: unknown, message?: string): void
    function deepEqual(actual: unknown, expected: unknown, message?: string): void
    function notEqual(actual: unknown, expected: unknown, message?: string): void
    function strictEqual(actual: unknown, expected: unknown, message?: string): void
    function deepStrictEqual(actual: unknown, expected: unknown, message?: string): void
    function throws(block: () => void, message?: string): void
  }
  export default assert
}

declare module 'assert' {
  function assert(value: unknown, message?: string): void
  namespace assert {
    function equal(actual: unknown, expected: unknown, message?: string): void
    function deepEqual(actual: unknown, expected: unknown, message?: string): void
    function notEqual(actual: unknown, expected: unknown, message?: string): void
    function strictEqual(actual: unknown, expected: unknown, message?: string): void
    function deepStrictEqual(actual: unknown, expected: unknown, message?: string): void
    function throws(block: () => void, message?: string): void
  }
  export default assert
}
