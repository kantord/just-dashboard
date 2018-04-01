import { format_value } from '../../interpolation.js'

const format_arguments = (args) => {
  if (!has_state_handler(args)) return args
  return format_value(args, args.state_handler.get_state())
}

const format_data = (args, data) => {
  if (!has_state_handler(args)) return data
  return format_value(data, args.state_handler.get_state())
}

const has_state_handler = (args) => {
  if (args === undefined) return false
  if (args.state_handler === undefined) return false
  if (args.state_handler.get_state === undefined) return false
  return true
}



export { format_arguments, format_data, has_state_handler }
