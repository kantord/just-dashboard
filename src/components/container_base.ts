import default_parser from '../default_parser'
import Component from './base'
import type { ComponentArgs, ComponentConfig, D3Selection } from '../types'

interface ContainerConfig {
  wrapper_tag?: string
  wrapper_class?: string
  validators?: ComponentConfig['validators']
  init?: ComponentConfig['init']
}

const ContainerComponent = (
  { wrapper_tag, wrapper_class, validators, init }: ContainerConfig) => Component({
  'render': (args, selection, _, __, data) => {
    selection.selectAll('*').remove()
    if (data instanceof Array) data.map((definition) => {
      const wrapper = selection
        .append(wrapper_tag as string)
        .attr('class', wrapper_class as string)
      const updated_definition = Object.assign({}, definition)
      if (updated_definition.args === undefined) updated_definition.args = {}
      if (args !== undefined) {
        updated_definition.args.state_handler = args.state_handler
        updated_definition.args.file_loader = args.file_loader
      }
      default_parser(updated_definition)(wrapper)
    })
  },
  'init': init,
  'validators': validators || [],
})

export default ContainerComponent
