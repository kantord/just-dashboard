import * as d3 from 'd3'

const Component = (args) => {
  if (!args.hasOwnProperty('render')) throw new Error("A render() function is required")

  return (instance_args) => {
    args.validators.map((validator) => validator(instance_args))
    return (selection) => {
      if (!(selection instanceof d3.selection)) throw new Error('A d3 selection is required')
      return (data) => args.render(instance_args, selection, data)
    }
  }
}

export default Component
