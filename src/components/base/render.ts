import emuto from '../../jq-web'
import type { ComponentArgs, ComponentConfig, D3Selection } from '../../types'
import show_error_message from './error_handling'
import with_spinner from './spinner'
import { format_data } from './state_handling'

const call_render_function =
  (args: ComponentConfig, instance_args: ComponentArgs, selection: D3Selection, element: D3Selection) =>
  (data: unknown) => {
    try {
      args.render(instance_args, selection, format_data(instance_args, data), element, data)
    } catch (error) {
      selection.call(show_error_message(`${error} [render]`))
    }
  }

const execute_query =
  (query: string, data: unknown) => (reject: (error: unknown) => void) => (resolve: (result: unknown) => void) =>
    emuto(data, query)
      .then((result) => {
        console.log('data!!!', result)
        return resolve(result)
      }) // eslint-disable-line
      .catch((error) => {
        reject(error)
      })

const render_component_with_query =
  (args: ComponentConfig, instance_args: ComponentArgs, selection: D3Selection, element: D3Selection) =>
  (data: unknown) =>
    with_spinner(selection)(
      execute_query(instance_args.query as string, data)((e) => show_error_message(`${e} [render]`)(selection)),
    )(call_render_function(args, instance_args, selection, element))

const has_query = (instance_args: ComponentArgs | undefined): boolean =>
  instance_args !== undefined && Object.hasOwn(instance_args, 'query')

const render_component = (args: ComponentConfig, instance_args: ComponentArgs, ...rest: [D3Selection, D3Selection]) =>
  has_query(instance_args)
    ? render_component_with_query(args, instance_args, ...rest)
    : call_render_function(args, instance_args, ...rest)

export default render_component
export { execute_query }
