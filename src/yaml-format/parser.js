import yaml from 'js-yaml'

const rules = [
  [[/dashboard ["]([^"]*)["]/, /dashboard [']([^']*)[']/], (match, value) => ({
    'component': 'root',
    'args': {'title': match[1]},
    'data': value.map(parser)
  })],
  [[/(.*) text/], (match, value) => ({
    'component': 'text',
    'args': {'tagName': match[1]},
    'data': value
  })]
]


const parser = (input) => {
  const yaml_contents = yaml.safeLoad(input)
  if (yaml_contents === undefined)
    throw new Error('A non-empty input file is required')

  const key = Object.keys(yaml_contents)[0]
  const value = Object.values(yaml_contents)[0]

  for (const rule of rules) {
    const [ patterns, func ] = rule
    for (const pattern of patterns) {
      if (key.match(pattern)) return func(key.match(pattern), value)
    }
      
  }
}

export default parser
