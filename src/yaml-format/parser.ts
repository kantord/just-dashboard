import YAML from 'yaml'

interface ComponentDef {
  component: string
  args?: Record<string, unknown>
  data?: unknown
}

type RuleHandler = (match: RegExpMatchArray, value: unknown) => ComponentDef
type Rule = [RegExp[], RuleHandler]

const rules: Rule[] = [
  [
    [/dashboard ["]([^"]*)["]/, /dashboard [']([^']*)[']/],
    (match, value) => ({
      component: 'root',
      args: { title: match[1] },
      data: (value as unknown[]).map(parser),
    }),
  ],
  [
    [/(.*) text/],
    (match, value) => ({
      component: 'text',
      args: { tagName: match[1] },
      data: value,
    }),
  ],
  [
    [/rows/],
    (_match, value) => ({
      component: 'rows',
      data: (value as unknown[]).map(parser),
    }),
  ],
  [
    [/board/],
    (_match, value) => ({
      component: 'board',
      data: (value as unknown[]).map(parser),
    }),
  ],
  [
    [/([1-9]+) columns/],
    (match, value) => ({
      component: 'columns',
      args: { columns: (match[1] as unknown as number) * 1 },
      data: (value as unknown[]).map(parser),
    }),
  ],
  [
    [/columns/],
    (_match, value) => ({
      component: 'columns',
      data: (value as unknown[]).map(parser),
    }),
  ],
  [
    [/dropdown ([^=]+)=(.*)/],
    (match, value) => ({
      component: 'dropdown',
      args: { variable: match[1], default: match[2] },
      data: value,
    }),
  ],
  [
    [/(horizontal|rotated)? *(stacked)? *([a-z]+|\${[A-z_0-9]+}) (chart|plot|diagram|graph)/], // eslint-disable-line
    (match, value) => ({
      component: 'chart',
      args: Object.assign(
        {},
        {
          type: match[3],
          stacked: match[2] === 'stacked',
        },
        match[1] === 'horizontal' || match[1] === 'rotated'
          ? {
              axis: {
                rotated: true,
              },
            }
          : {},
      ),
      data: value,
    }),
  ],
]

const handle_urls = (component: ComponentDef): ComponentDef => {
  if (typeof component.data === 'string' && component.data.match(/https?:/))
    return {
      component: component.component,
      args: Object.assign(
        {
          loader: component.data.match(/https?.*\.(.*)$/)![1],
        },
        component.args,
      ),
      data: component.data,
    }

  return component
}

const handle_files = (component: ComponentDef): ComponentDef => {
  if (typeof component.data === 'string' && component.data.match(/file:/))
    return {
      component: component.component,
      args: Object.assign(
        {
          loader: component.data.match(/file.*\.(.*)$/)![1],
          is_file: true,
        },
        component.args,
      ),
      data: component.data,
    }

  return component
}

const handle_attr_syntax = (component: ComponentDef): ComponentDef => {
  if ((component.data as any[]).map === undefined) return component
  const attrs = (component.data as Record<string, unknown>[]).filter((x) => Object.keys(x)[0].match(/attr:.*/))
  if (attrs.length === 0) return component

  const mapped_attrs = attrs.map((x) => [Object.keys(x)[0], Object.values(x)[0]])
  const parsed_args: Record<string, unknown> = {}
  mapped_attrs.map((value) => (parsed_args[(value[0] as string).match(/attr:(.*)/)![1]] = value[1]))

  return {
    component: component.component,
    args: Object.assign(parsed_args, component.args ? component.args : {}),
    data: (component.data as Record<string, unknown>[]).filter((x) => Object.keys(x)[0] === 'data')[0].data,
  }
}

export const error_message = (message: string): ComponentDef => ({
  component: 'root',
  args: { title: message },
  data: [
    {
      component: 'text',
      args: { tagName: 'p' },
      data: message,
    },
  ],
})

const parser = (input: unknown): ComponentDef => {
  try {
    const yaml_contents = typeof input === 'string' ? YAML.parse(input) : (input as Record<string, unknown>)
    if (yaml_contents === undefined) return error_message('A non-empty input file is required')

    const key = Object.keys(yaml_contents)[0]
    const value = Object.values(yaml_contents)[0]

    for (const rule of rules) {
      const [patterns, func] = rule
      for (const pattern of patterns) {
        if (key.match(pattern)) return handle_files(handle_urls(handle_attr_syntax(func(key.match(pattern)!, value))))
      }
    }

    return yaml_contents as unknown as ComponentDef
  } catch (error) {
    return error_message((error as Error).toString())
  }
}

export default parser
