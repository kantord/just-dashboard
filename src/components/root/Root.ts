import Component from '../base'
import default_parser from '../../default_parser'
import { required } from '../../validators'
import type { ComponentDef } from '../../types'

const RootComponent = Component({
  'validators': [required('title')],
  'init': (args, selection) => {selection.select('title').text(args.title as string)},
  'render': (args, selection, data) => {
    const body = selection.select('body')
    body.selectAll('*').remove()
    // "unsubscribe" the elements we've just removed
    if (args.state_handler) args.state_handler.reset()
    if (data instanceof Array) data.map((definition: ComponentDef) => {
      const updated_definition = Object.assign({'args': {}}, definition) as Record<string, any>
      updated_definition.args.state_handler = args.state_handler
      updated_definition.args.file_loader = args.file_loader
      default_parser(updated_definition)(body.append('div')
        .attr('class', 'ds--wrapper'))
    })
  }
})

export default RootComponent
