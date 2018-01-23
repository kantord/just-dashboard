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

const create_spinner = (selection) =>
    selection.append('div')
      .attr('class', 'spinner sk-spinner sk-spinner-pulse')

const render_component = (args, instance_args, selection) => (data) => {
  if (instance_args !== undefined && instance_args.hasOwnProperty('query')) {
    const spinner = create_spinner(selection)
    jq(data, instance_args.query).then(new_data => {
      spinner.remove()
      args.render(instance_args, selection, new_data)})
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
          const spinner = create_spinner(selection)
          loader(instance_args.loader)(data)((data) => {
            render_component(args, instance_args, selection)(data)
            spinner.remove()
          })
        } else {
          render_component(args, instance_args, selection)(data)
        }
      }
    }
  }
}

export default Component
