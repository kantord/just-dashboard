import * as d3 from 'd3'
import jq from '../jq-web.js'
import { format_value } from '../interpolation.js'

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

const loader_exists = (loader_name) =>
  loaders[loader_name] !== undefined

const with_loader = (loader_name) => (source) => (callback) => {
  if (!loader_exists(loader_name)) throw new Error('Invalid loader')
  loaders[loader_name](source, callback)
}

const create_spinner = (selection) =>
  selection.append('div')
    .attr('class', 'spinner sk-spinner sk-spinner-pulse')

const with_spinner = (selection) => (func) => (callback) => {
  const spinner = create_spinner(selection)
  return func((...args) => {
    spinner.remove()
    callback(...args)
  })
}

const has_query = (instance_args) =>
  instance_args !== undefined && instance_args.hasOwnProperty('query')

const call_render_function = (args, instance_args, selection, element) => (data) =>
  args.render(instance_args, selection, data, element)

const execute_query = (query, data) =>
  (callback) =>
    jq(data, query).then((data) => callback(data))

const render_component_with_query = (args, instance_args, selection, element) => (data) =>
  with_spinner(selection)(
    execute_query(instance_args.query, data))(
    call_render_function(args, instance_args, selection, element))

const render_component = (args, instance_args, ...rest) => 
  has_query(instance_args)
    ? render_component_with_query(args, instance_args, ...rest)
    : call_render_function(args, instance_args, ...rest)


const create_element = (init_func, instance_args, selection) =>
  (typeof init_func === 'function') ? init_func(instance_args, selection) : null 

const load_external_data = (raw_data) => (loader_func, spinner_func) =>
  spinner_func(loader_func(raw_data))

const has_loader = (instance_args) =>
  instance_args !== undefined && instance_args.hasOwnProperty('loader')

const handle_external_data = (instance_args, selection, raw_data) => (resolve) =>
  has_loader(instance_args)
    ? load_external_data(raw_data)(
      with_loader(instance_args.loader),
      with_spinner(selection))(
      (_, data) => resolve(data))
    : resolve(raw_data)

const create_bind_function = (args, instance_args) => (selection) => {
  validate_selection(selection)
  let element = create_element(args.init, format_arguments(instance_args), selection)

  return (raw_data) => {
    const render_ = () => handle_external_data(instance_args, selection, raw_data)(
      render_component(args, format_arguments(instance_args), selection, element))
    if (has_state_handler(instance_args)) {
      instance_args.state_handler.subscribe((state_handler, me) => {
        element.remove()
        element = create_element(args.init, format_arguments(instance_args), selection)
        state_handler.subscribe(me)
        render_()
      })
    }
    render_()
  }
}

const has_state_handler = (args) => {
  if (args === undefined) return false
  if (args.state_handler === undefined) return false
  if (args.state_handler.get_state === undefined) return false
  return true
}

const format_arguments = (args) => {
  if (!has_state_handler(args)) return args
  return format_value(args, args.state_handler.get_state())
}

const create_component_function = (args) => (instance_args) => {
  execute_validations(args.validators)(instance_args)
  return create_bind_function(args, instance_args)
}

const Component = (args) => {
  if (!args.hasOwnProperty('render')) throw new Error('A render() function is required')
  return create_component_function(args)
}

export default Component
