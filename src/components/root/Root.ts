import default_parser from '../../default_parser'
import type { ComponentDef } from '../../types'
import { required } from '../../validators'
import Component from '../base'

const RootComponent = Component({
  validators: [required('title')],
  init: (args, selection) => {
    selection.select('title').text(args.title as string)
    return undefined
  },
  render: (args, selection, data) => {
    const body = selection.select('body')
    body.selectAll('*').remove()
    // "unsubscribe" the elements we've just removed
    if (args.state_handler) args.state_handler.reset()
    if (Array.isArray(data))
      data.forEach((definition: ComponentDef) => {
        const updated_definition = Object.assign({ args: {} }, definition) as Record<string, any>
        updated_definition.args.state_handler = args.state_handler
        updated_definition.args.file_loader = args.file_loader
        default_parser(updated_definition)(body.append('div').attr('class', 'ds--wrapper'))
      })
  },
})

export default RootComponent
