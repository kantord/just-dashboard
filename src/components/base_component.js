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

const with_spinner = (selection) => (callback) => (func) => {
  const spinner = create_spinner(selection)
  func((a, b, c) => {
    spinner.remove()
    callback(a, b, c)
  })
}

const create_spinner = (selection) =>
  selection.append('div')
    .attr('class', 'spinner sk-spinner sk-spinner-pulse')

const render_component = (args, instance_args, selection) => (data) => {
  if (instance_args !== undefined && instance_args.hasOwnProperty('query')) {
    with_spinner(selection)((new_data => {
      args.render(instance_args, selection, new_data)}))(jq(data, instance_args.query).then)
  } else {
    args.render(instance_args, selection, data)
  }
}

const Component = (args) => {
  if (!args.hasOwnProperty('render')) throw new Error('A render() function is required')

  return (instance_args) => {
    execute_validations(args.validators)(instance_args)
    return (selection) => {
      validate_selection(selection)
      if (typeof args.init === 'function') args.init(instance_args, selection)
      return (data) => {
        if (instance_args !== undefined && instance_args.hasOwnProperty('loader')) {
          with_spinner(selection)((data) => {
            render_component(args, instance_args, selection)(data)
          })(loader(instance_args.loader)(data))
        } else {
          render_component(args, instance_args, selection)(data)
        }
      }
    }
  }
}

export default Component
