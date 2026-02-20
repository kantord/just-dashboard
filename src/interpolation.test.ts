import * as module from './interpolation'

const string_tests: [string, string, Record<string, unknown>][] = [
  ['foo', 'foo', {}],
  ['Hello World!', 'Hello World!', {}],
  ['Hello ${name}', 'Hello World!', { name: 'World!' }],
  ['Hello ${name}!', 'Hello Person!', { name: 'Person' }],
  ['${greeting} ${name}!', 'Hola Person!', { name: 'Person', greeting: 'Hola' }],
  ['${foo} ${bar}!', 'Hola Person!', { bar: 'Person', foo: 'Hola' }],
]

const array_tests: [unknown[], unknown[], Record<string, unknown>][] = [
  [[], [], {}],
  [['Hello ${name}!'], ['Hello World!'], { name: 'World' }],
  [['Hello ${foo}!'], ['Hello World!'], { foo: 'World' }],
  [['Hello ${foo}!', 'Hello ${foo}!'], ['Hello World!', 'Hello World!'], { foo: 'World' }],
  [['Hello ${foo}!', ['Hello ${foo}!']], ['Hello World!', ['Hello World!']], { foo: 'World' }],
  [['Hello ${foo}!', [{ '${foo}': 42 }]], ['Hello World!', [{ World: 42 }]], { foo: 'World' }],
]

const static_tests: [unknown, unknown, Record<string, unknown>][] = [
  [42, 42, {}],
  [false, false, {}],
  [889593.234234, 889593.234234, {}],
  [[null], [null], {}],
]

const object_tests: [Record<string, unknown>, Record<string, unknown>, Record<string, unknown>][] = [
  [{}, {}, {}],
  [{ foo: '${bar}' }, { foo: 'hello' }, { bar: 'hello' }],
  [
    { foo: '${bar}', baz: '${asd}' },
    { foo: 'hello', baz: '33' },
    { bar: 'hello', asd: '33' },
  ],
  [
    { '${bar}': '${bar}', baz: '${asd}' },
    { hello: 'hello', baz: '33' },
    { bar: 'hello', asd: '33' },
  ],
  [
    { '${bar}': ['${bar}'], baz: '${asd}' },
    { hello: ['hello'], baz: '33' },
    { bar: 'hello', asd: '33' },
  ],
]

type TestSuite = [string, string, unknown[][][]]

const tests: TestSuite[] = [
  ['String interpolation', 'format_string', [string_tests]],
  ['Array interpolation', 'format_array', [array_tests]],
  ['Value interpolation', 'format_value', [string_tests, array_tests, static_tests, object_tests]],
  ['Object interpolation', 'format_object', [object_tests]],
]

const stringify = JSON.stringify

tests.forEach(([test_suite_name, function_name, test_sets]) =>
  describe(test_suite_name as string, () => {
    ;(test_sets as unknown[][][]).forEach((test_set: unknown[][]) =>
      test_set.forEach(([input, output, state]) =>
        it(`${[stringify(input), stringify(output), stringify(state)]}`, () => {
          expect((module as Record<string, any>)[function_name as string](input, state)).toEqual(output)
        }),
      ),
    )
  }),
)
