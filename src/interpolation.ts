type State = Record<string, unknown>

const format_string = (input: string, state: State): string => {
  if (Object.entries(state).length === 0) return input
  const first_key = Object.keys(state)[0]
  const copy = Object.assign({}, state)
  delete copy[first_key]
  return format_string(input.replace('${' + first_key + '}', String(state[first_key])),
    copy)
}

const format_array = (input: unknown[], state: State): unknown[] => {
  return input.map(item => format_value(item, state))
}

const format_value = (input: unknown, state: State): unknown => {
  if (input === null) return null
  if (input instanceof Array) return format_array(input, state)
  if (typeof input === 'string') return format_string(input, state)
  if (typeof input === 'object') return format_object(input as Record<string, unknown>, state)
  return input
}

const format_object = (input: Record<string, unknown>, state: State): Record<string, unknown> => {
  return Object.assign({}, ...Object.entries(input).map(
    ([key, value]) => (
      {[format_string(key, state)]: format_value(value, state)})
  ))
}

export { format_string , format_array, format_value, format_object }
