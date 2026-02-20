import type { ComponentArgs, ComponentConfig } from '../../types'
import create_bind_function from './bind'
import { format_arguments } from './state_handling'

const execute_validations = (validators: ComponentConfig['validators']) => (args: ComponentArgs) =>
  validators!.map((validator) => validator(args as Record<string, unknown>))

const create_component_function = (args: ComponentConfig) => (instance_args: ComponentArgs) => {
  execute_validations(args.validators)(format_arguments(instance_args))
  return create_bind_function(args, instance_args)
}

const Component = (args: ComponentConfig) => {
  if (!Object.hasOwn(args, 'render')) throw new Error('A render() function is required')
  return create_component_function(args)
}

export default Component
