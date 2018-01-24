import * as d3 from 'd3'
import jq from '../jq-web.js'

const loaders = {
  'csv': d3.csv,
  'tsv': d3.tsv,
  'text': d3.text,
  'json': d3.json
}

const execute_validations = (validators) => (args) =>
  validators.map((validator) => validator(args))

const validate_selection = (selection) => {
  if (!(selection instanceof d3.selection)) throw new Error('A d3 selection is required')
}

const loader = (loader_name) => (source) => (callback) => {
  if (loaders[loader_name] === undefined) throw new Error('Invalid loader')
  loaders[loader_name](source, callback)
}

const with_spinner = (selection) => (func) => (callback) => {
  const spinner = create_spinner(selection)
  return func((...args) => {
    spinner.remove()
    callback(...args)
  })
}

const create_spinner = (selection) =>
  selection.append('div')
    .attr('class', 'spinner sk-spinner sk-spinner-pulse')

const render_component = (args, instance_args, selection, init_return_value) => (data) => {
  if (instance_args !== undefined && instance_args.hasOwnProperty('query')) {
    with_spinner(selection)((callback) =>
      jq(data, instance_args.query).then((data) => callback(data))
    )((new_data => {
      args.render(instance_args, selection, new_data, init_return_value)}))
  } else {
    args.render(instance_args, selection, data, init_return_value)
  }
}

const Component = (args) => {
  if (!args.hasOwnProperty('render')) throw new Error('A render() function is required')

  return (instance_args) => {
    execute_validations(args.validators)(instance_args)
    return (selection) => {
      validate_selection(selection)
      const init_return_value = (typeof args.init === 'function') ? args.init(instance_args, selection) : null
      return (data) => {
        if (instance_args !== undefined && instance_args.hasOwnProperty('loader')) {
          with_spinner(selection)(loader(instance_args.loader)(data))(function(_, data) {
            render_component(args, instance_args, selection, init_return_value)(data)
          })
        } else {
          render_component(args, instance_args, selection, init_return_value)(data)
        }
      }
    }
  }
}

export default Component
