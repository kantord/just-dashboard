import * as d3 from 'd3'
import { format_arguments, has_state_handler } from './state_handling'
import handle_external_data from './external_data'
import render_component from './render'
import show_error_message from './error_handling'

const validate_selection = (selection) => {
  if (!(selection instanceof d3.selection))
    throw new Error('A d3 selection is required')
}

const create_element = (init_func, instance_args, selection) => {
  try {
    return (typeof init_func === 'function')
      ? init_func(instance_args, selection) : selection.append('span')
  } catch(error) {
    selection.call(show_error_message(`${error} [bind]`))
    return selection
  }
}

const create_bind_function = (args, instance_args) => (selection) => {
  validate_selection(selection)
  let element = create_element(args.init, format_arguments(instance_args),
    selection)

  return (raw_data) => {
    const render_ = () => handle_external_data(
      instance_args, selection, raw_data)(render_component(
      args, format_arguments(instance_args), selection, element))
    if (has_state_handler(instance_args)) {
      instance_args.state_handler.subscribe((state_handler, me) => {
        if (element === null || (element && element.node
          && !document.contains(element.node()))) return
        state_handler.subscribe(me)
        console.log('shit', element)
        if (element) {
          element.remove()
        } else {
          throw new Error('this should not happen ever')
        }
        element = create_element(
          args.init, format_arguments(instance_args), selection)
        render_()
      })
    }
    render_()
  }
}

export default create_bind_function
