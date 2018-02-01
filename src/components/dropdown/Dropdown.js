import Component from '../base_component.js'
import { required } from '../../validators'
import { regexp } from '../../validators'

const DropdownComponent = Component({
  'validators': [
    required('variable'), regexp('variable', /^[A-Za-z]([_A-Za-z0-9-]*[_A-Za-z0-9])?$/),
    required('default')],
  'init': (args, selection) => selection.append('select').attr('class', 'ds--select'),
  'render': (args, selection, data, item) => {
    const join = item.selectAll('option').data(data)
    join.enter()
      .append('option')
      .attr('class', 'ds--select-option')
      .property('value', d => d.value)
      .text(d => d.text)
    join.exit()
      .remove()
    join
      .property('value', d => d.value)
      .text(d => d.text)
  }
})

export default DropdownComponent
