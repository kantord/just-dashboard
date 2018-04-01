import { format_arguments } from './state_handling'
import create_bind_function from './bind'

const execute_validations = (validators) => (args) =>
  validators.map((validator) => validator(args))

const create_component_function = (args) => (instance_args) => {
  execute_validations(args.validators)(format_arguments(instance_args))
  return create_bind_function(args, instance_args)
}

const Component = (args) => {
  if (!args.hasOwnProperty('render'))
    throw new Error('A render() function is required')
  return create_component_function(args)
}

export default Component
