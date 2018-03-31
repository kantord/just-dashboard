import default_parser from '../default_parser.js'
import Component from './base'

const ContainerComponent = (
  { wrapper_tag, wrapper_class, validators, init }) => Component({
  'render': (args, selection, _, __, data) => {
    selection.selectAll('*').remove()
    if (data instanceof Array) data.map((definition) => {
      const wrapper = selection
        .append(wrapper_tag)
        .attr('class', wrapper_class)
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
