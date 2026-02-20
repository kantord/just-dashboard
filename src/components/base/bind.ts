import * as d3 from 'd3'
import { format_arguments, has_state_handler } from './state_handling'
import handle_external_data from './external_data'
import render_component from './render'
import show_error_message from './error_handling'
import type { D3Selection, ComponentArgs, ComponentConfig } from '../../types'

const validate_selection = (selection: unknown): void => {
  if (!(selection instanceof d3.selection))
    throw new Error('A d3 selection is required')
}

const create_element = (init_func: ComponentConfig['init'], instance_args: ComponentArgs, selection: D3Selection): D3Selection => {
  try {
    return (typeof init_func === 'function')
      ? (init_func(instance_args, selection) as D3Selection) : selection.append('span')
  } catch(error) {
    selection.call(show_error_message(`${error} [bind]`))
    return selection
  }
}

const create_bind_function = (args: ComponentConfig, instance_args: ComponentArgs) => (selection: D3Selection) => {
  validate_selection(selection)
  let element: D3Selection | null = create_element(args.init, format_arguments(instance_args),
    selection)

  return (raw_data: unknown) => {
    const render_ = () => handle_external_data(
      instance_args, selection, raw_data)(render_component(
      args, format_arguments(instance_args), selection, element!))
    if (has_state_handler(instance_args)) {
      instance_args.state_handler!.subscribe((state_handler, me) => {
        if (element === null || (element && element.node
          && !document.contains(element.node() as Node))) return
        state_handler.subscribe(me)
        if (element) element.remove()
        element = create_element(
          args.init, format_arguments(instance_args), selection)
        render_()
      })
    }
    render_()
  }
}

export default create_bind_function
