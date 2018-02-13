import default_parser from '../default_parser.js'
import Component from './base_component.js'

const ContainerComponent = ({ wrapper_tag, wrapper_class, validators, init }) => Component({
  'render': (args, selection, data) => {
    selection.selectAll(wrapper_tag).remove()
    if (data instanceof Array) data.map((definition) => {
      const wrapper = selection
        .append(wrapper_tag)
        .attr('class', wrapper_class)
      const updated_definition = Object.assign({}, definition)
      if (args !== undefined) updated_definition.args.init_variable = args.init_variable
      if (args !== undefined) updated_definition.args.set_variable = args.set_variable
      default_parser(updated_definition)(wrapper)
    })
  },
  'init': init,
  'validators': validators || [],
})

export default ContainerComponent
