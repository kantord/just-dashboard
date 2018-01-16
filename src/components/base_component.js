import * as d3 from 'd3'
var jq = require('jq-web')

const execute_validations = (validators) => (args) =>
  validators.map((validator) => validator(args))

const validate_selection = (selection) => {
  if (!(selection instanceof d3.selection)) throw new Error('A d3 selection is required')
}

const Component = (args) => {
  if (!args.hasOwnProperty('render')) throw new Error('A render() function is required')

  return (instance_args) => {
    execute_validations(args.validators)(instance_args)
    return (selection) => {
      validate_selection(selection)
      if (typeof args.init === 'function') args.init(instance_args, selection)
      return (data) => {
        if (instance_args !== undefined && instance_args.hasOwnProperty('query')) {
          args.render(instance_args, selection, jq(data, instance_args.query))
        } else {
          args.render(instance_args, selection, data)
        }
      }
    }
  }
}

export default Component
