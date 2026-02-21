import { vi } from 'vitest'

type ParseFn = (input: string) => unknown

const mocks = vi.hoisted(() => ({
  yamlParse: vi.fn() as unknown as ParseFn,
}))

vi.mock('yaml', () => ({
  default: { parse: (input: string) => mocks.yamlParse(input) },
}))

import parser, { error_message } from './parser'

interface TestCase {
  input: Record<string, unknown>
  output: Record<string, unknown>
}

describe('yaml format - parser', () => {
  const set_up = ({ parseSpyReturns, parseSpyThrows }: { parseSpyReturns?: unknown; parseSpyThrows?: string }) => {
    if (parseSpyThrows) {
      mocks.yamlParse = vi.fn(() => {
        throw new Error(parseSpyThrows)
      })
    } else {
      mocks.yamlParse = vi.fn(() => parseSpyReturns)
    }
    return { parser, parseSpy: mocks.yamlParse, error_message }
  }

  it('should display error for empty input', () => {
    const { parser, error_message } = set_up({ parseSpyReturns: undefined })
    expect(parser('')).toEqual(error_message('A non-empty input file is required'))
  })

  it('should display error thrown by safeLoad', () => {
    const error = 'foo bar baz!'
    const { parser, error_message } = set_up({ parseSpyThrows: error })
    expect(parser('')).toEqual(error_message(error))
  })

  it('should not display error for valid input', () => {
    const { parser, error_message } = set_up({
      parseSpyReturns: { 'dashboard "Hello World"': [] },
    })
    expect(parser('dashboard "Hello World": []')).not.toEqual(error_message('A non-empty input file is required'))
  })

  it('yaml is only parsed if input is a string', () => {
    const { parser, parseSpy } = set_up({ parseSpyReturns: [] })
    parser({ 'h1 text': '' })
    expect(parseSpy).not.toHaveBeenCalled()
  })

  const inputs = ['foo', 'bar']

  inputs.forEach((arg) =>
    it(`yaml called with input - ${arg}`, () => {
      const { parser, parseSpy } = set_up({ parseSpyReturns: { 'dashboard "a"': [] } })
      parser(arg)
      expect(parseSpy).toHaveBeenCalledWith(arg)
    }),
  )
})

describe('yaml format - root component', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    {
      input: { 'dashboard "Foo"': [] },
      output: { component: 'root', args: { title: 'Foo' }, data: [] },
    },
    {
      input: { 'dashboard "Bar"': [] },
      output: { component: 'root', args: { title: 'Bar' }, data: [] },
    },
    {
      input: { "dashboard 'x'": [] },
      output: { component: 'root', args: { title: 'x' }, data: [] },
    },
    {
      input: { "dashboard 'Ba\"r'": [] },
      output: { component: 'root', args: { title: 'Ba"r' }, data: [] },
    },
    {
      input: { 'dashboard "Foo"': [{ 'b text': 'a' }] },
      output: {
        component: 'root',
        args: { title: 'Foo' },
        data: [{ component: 'text', args: { tagName: 'b' }, data: 'a' }],
      },
    },
    {
      input: { 'dashboard "Foo"': [{ 'p text': 'x' }, { 'h1 text': 'p' }] },
      output: {
        component: 'root',
        args: { title: 'Foo' },
        data: [
          { component: 'text', args: { tagName: 'p' }, data: 'x' },
          { component: 'text', args: { tagName: 'h1' }, data: 'p' },
        ],
      },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${(Object.values(input)[0] as unknown[]).length}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - text component', () => {
  const set_up = (parseSpyReturns: unknown) => {
    mocks.yamlParse = vi.fn(() => parseSpyReturns)
    return { parser }
  }

  const tests: TestCase[] = [
    { input: { 'h1 text': [] }, output: { component: 'text', args: { tagName: 'h1' }, data: [] } },
    { input: { 'p text': [] }, output: { component: 'text', args: { tagName: 'p' }, data: [] } },
    { input: { 'p text': 'foo' }, output: { component: 'text', args: { tagName: 'p' }, data: 'foo' } },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${String(Object.values(input)[0])}`, () => {
      const { parser } = set_up(input)
      expect(parser('')).toEqual(output)
    })
  })
})

describe('yaml format - board component', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    { input: { board: [] }, output: { component: 'board', data: [] } },
    {
      input: { board: [{ board: [] }] },
      output: { component: 'board', data: [{ component: 'board', data: [] }] },
    },
    {
      input: { board: [{ 'attr:query': 'asd' }, { data: 'xxxxx' }] },
      output: { component: 'board', args: { query: 'asd' }, data: 'xxxxx' },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${(Object.values(input)[0] as unknown[]).length}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - rows component', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    { input: { rows: [] }, output: { component: 'rows', data: [] } },
    {
      input: { rows: [{ rows: [] }] },
      output: { component: 'rows', data: [{ component: 'rows', data: [] }] },
    },
    {
      input: { rows: [{ 'attr:query': 'asd' }, { data: 'xxxxx' }] },
      output: { component: 'rows', args: { query: 'asd' }, data: 'xxxxx' },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${(Object.values(input)[0] as unknown[]).length}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - columns component', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    { input: { columns: [] }, output: { component: 'columns', data: [] } },
    {
      input: { columns: [{ columns: [] }] },
      output: { component: 'columns', data: [{ component: 'columns', data: [] }] },
    },
    {
      input: { '3 columns': [{ columns: [] }] },
      output: { component: 'columns', args: { columns: 3 }, data: [{ component: 'columns', data: [] }] },
    },
    {
      input: { '5 columns': [{ columns: [] }] },
      output: { component: 'columns', args: { columns: 5 }, data: [{ component: 'columns', data: [] }] },
    },
    {
      input: { '5 columns': [{ rows: [] }, { columns: [] }] },
      output: {
        component: 'columns',
        args: { columns: 5 },
        data: [
          { component: 'rows', data: [] },
          { component: 'columns', data: [] },
        ],
      },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${(Object.values(input)[0] as unknown[]).length}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - chart component', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    { input: { 'pie chart': [] }, output: { component: 'chart', args: { type: 'pie', stacked: false }, data: [] } },
    { input: { 'bar chart': [] }, output: { component: 'chart', args: { type: 'bar', stacked: false }, data: [] } },
    {
      input: { 'horizontal bar chart': [] },
      output: { component: 'chart', args: { type: 'bar', stacked: false, axis: { rotated: true } }, data: [] },
    },
    {
      input: { 'rotated line chart': [] },
      output: { component: 'chart', args: { type: 'line', stacked: false, axis: { rotated: true } }, data: [] },
    },
    {
      input: { 'scatter plot': [] },
      output: { component: 'chart', args: { type: 'scatter', stacked: false }, data: [] },
    },
    {
      input: { 'line diagram': [] },
      output: { component: 'chart', args: { type: 'line', stacked: false }, data: [] },
    },
    {
      input: { 'line graph': [] },
      output: { component: 'chart', args: { type: 'line', stacked: false }, data: [] },
    },
    {
      input: { 'bar chart': 'foo' },
      output: { component: 'chart', args: { type: 'bar', stacked: false }, data: 'foo' },
    },
    {
      input: { 'stacked bar chart': 'foo' },
      output: { component: 'chart', args: { type: 'bar', stacked: true }, data: 'foo' },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${String(Object.values(input)[0])}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - handling file', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    {
      input: { 'h1 text': 'file://example.com/text.csv' },
      output: {
        component: 'text',
        args: { loader: 'csv', tagName: 'h1', is_file: true },
        data: 'file://example.com/text.csv',
      },
    },
    {
      input: { 'h1 text': 'file://example.com/text.json' },
      output: {
        component: 'text',
        args: { loader: 'json', tagName: 'h1', is_file: true },
        data: 'file://example.com/text.json',
      },
    },
    {
      input: { 'h1 text': [{ 'attr:loader': 'csv' }, { data: 'file://example.com/text.json' }] },
      output: {
        component: 'text',
        args: { loader: 'csv', tagName: 'h1', is_file: true },
        data: 'file://example.com/text.json',
      },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${String(Object.values(input)[0])}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - handling URL', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    {
      input: { 'h1 text': 'https://example.com/text.csv' },
      output: { component: 'text', args: { loader: 'csv', tagName: 'h1' }, data: 'https://example.com/text.csv' },
    },
    {
      input: { 'h1 text': 'https://example.com/text.json' },
      output: { component: 'text', args: { loader: 'json', tagName: 'h1' }, data: 'https://example.com/text.json' },
    },
    {
      input: { 'h1 text': [{ 'attr:loader': 'csv' }, { data: 'https://example.com/text.json' }] },
      output: { component: 'text', args: { loader: 'csv', tagName: 'h1' }, data: 'https://example.com/text.json' },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${String(Object.values(input)[0])}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('yaml format - attr: syntax', () => {
  const set_up = () => {
    mocks.yamlParse = vi.fn((x: unknown) => x)
    return { parser }
  }

  const tests: TestCase[] = [
    {
      input: { 'h1 text': [{ 'attr:foo': 'bar' }, { data: 'https://example.com/text.csv' }] },
      output: {
        component: 'text',
        args: { loader: 'csv', tagName: 'h1', foo: 'bar' },
        data: 'https://example.com/text.csv',
      },
    },
    {
      input: { 'h1 text': [{ 'attr:foo': 'bar' }, { data: 'https://example.com/text.json' }] },
      output: {
        component: 'text',
        args: { loader: 'json', tagName: 'h1', foo: 'bar' },
        data: 'https://example.com/text.json',
      },
    },
    {
      input: { 'pie chart': [{ 'attr:foo': 'bar' }, { data: 'https://example.com/text.json' }] },
      output: {
        component: 'chart',
        args: { loader: 'json', type: 'pie', foo: 'bar', stacked: false },
        data: 'https://example.com/text.json',
      },
    },
    {
      input: { 'pie chart': [{ 'attr:bar': 'foo' }, { data: 'https://example.com/text.json' }] },
      output: {
        component: 'chart',
        args: { loader: 'json', type: 'pie', bar: 'foo', stacked: false },
        data: 'https://example.com/text.json',
      },
    },
    {
      input: {
        'pie chart': [{ 'attr:title': 'Hello World' }, { 'attr:pi': 3.14 }, { data: 'https://example.com/text.json' }],
      },
      output: {
        component: 'chart',
        args: { loader: 'json', type: 'pie', title: 'Hello World', pi: 3.14, stacked: false },
        data: 'https://example.com/text.json',
      },
    },
    {
      input: {
        '${var_Name1} chart': [
          { 'attr:title': 'Hello World' },
          { 'attr:pi': 3.14 },
          { data: 'https://example.com/text.json' },
        ],
      },
      output: {
        component: 'chart',
        args: { loader: 'json', type: '${var_Name1}', title: 'Hello World', pi: 3.14, stacked: false },
        data: 'https://example.com/text.json',
      },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${(Object.values(input)[0] as Record<string, unknown>[]).map(Object.keys)}`, () => {
      const { parser } = set_up()
      expect(parser(input)).toEqual(output)
    })
  })
})

describe('integration tests', () => {
  it('integration test', async () => {
    const realYaml = await vi.importActual<typeof import('yaml')>('yaml')
    mocks.yamlParse = (input: string) => realYaml.parse(input)
    const text = `dashboard "asd":
    - h1 text: asd
    - 3 columns:
      - p text: lorem ipsum
      - p text:
        - attr:foo: bar
        - data: x`
    const value = {
      component: 'root',
      args: { title: 'asd' },
      data: [
        { component: 'text', args: { tagName: 'h1' }, data: 'asd' },
        {
          component: 'columns',
          args: { columns: 3 },
          data: [
            { component: 'text', args: { tagName: 'p' }, data: 'lorem ipsum' },
            { component: 'text', args: { tagName: 'p', foo: 'bar' }, data: 'x' },
          ],
        },
      ],
    }
    expect(parser(text)).toEqual(value)
  })
})

describe('yaml format - dropdown component', () => {
  const set_up = (parseSpyReturns: unknown) => {
    mocks.yamlParse = vi.fn(() => parseSpyReturns)
    return { parser }
  }

  const tests: TestCase[] = [
    {
      input: { 'dropdown foo=bar': [] },
      output: { component: 'dropdown', args: { variable: 'foo', default: 'bar' }, data: [] },
    },
    {
      input: { 'dropdown foo=3.14': [] },
      output: { component: 'dropdown', args: { variable: 'foo', default: '3.14' }, data: [] },
    },
    {
      input: { 'dropdown name3=3.14': [] },
      output: { component: 'dropdown', args: { variable: 'name3', default: '3.14' }, data: [] },
    },
    {
      input: { 'dropdown name3=3.14': 42 },
      output: { component: 'dropdown', args: { variable: 'name3', default: '3.14' }, data: 42 },
    },
    {
      input: { 'dropdown chart=pie': 42 },
      output: { component: 'dropdown', args: { variable: 'chart', default: 'pie' }, data: 42 },
    },
  ]

  tests.forEach(({ input, output }) => {
    it(`${Object.keys(input)[0]} - ${String(Object.values(input)[0])}`, () => {
      const { parser } = set_up(input)
      expect(parser('')).toEqual(output)
    })
  })
})
