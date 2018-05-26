import with_spinner from './spinner'
import jq from '../../jq-web.js'
import show_error_message from './error_handling'
import { format_data } from './state_handling'

const call_render_function = (args, instance_args, selection, element) =>
  (data) => {
    try {
      args.render(instance_args, selection, format_data(instance_args, data),
        element, data)
    } catch (error) {
      selection.call(show_error_message(`${error} [render]`))
    }
  }

const execute_query = (query, data) =>
  (reject) => (resolve) =>
    jq(data, query)
      .then((data) => resolve(data))
      .catch((error) => {reject(error)})

const render_component_with_query = (args, instance_args, selection,
  element) => (data) =>
  with_spinner(selection)(
    execute_query(instance_args.query, data)(
      e => show_error_message(`${e} [render]`)(selection)))(
    call_render_function(args, instance_args, selection, element))

const has_query = (instance_args) =>
  instance_args !== undefined && instance_args.hasOwnProperty('query')

const render_component = (args, instance_args, ...rest) => 
  has_query(instance_args)
    ? render_component_with_query(args, instance_args, ...rest)
    : call_render_function(args, instance_args, ...rest)


export default render_component
export { execute_query }
