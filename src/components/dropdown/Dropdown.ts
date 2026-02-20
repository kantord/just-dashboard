import Component from '../base'
import { required } from '../../validators'
import { regexp } from '../../validators'
import * as d3 from 'd3'
import type { D3Selection } from '../../types'

interface DropdownItem {
  value: string
  text: string
}

const set_values = (selection: D3Selection) => selection
  .property('value', (d: DropdownItem) => d.value)
  .text((d: DropdownItem) => d.text)

const enter = (selection: D3Selection) => selection
  .enter()
  .append('option')
  .attr('class', 'ds--select-option')
  .call(set_values)

const exit = (selection: D3Selection) => selection
  .exit()
  .remove()

const update = (selection: D3Selection) => selection
  .call(set_values)

const update_pattern = (selection: D3Selection) =>
  [enter, exit, update].map(f => f(selection))

const DropdownComponent = Component({
  'validators': [
    required('variable'),
    regexp('variable', /^[A-Za-z]([_A-Za-z0-9-]*[_A-Za-z0-9])?$/),
    required('default')],
  'init': (args, selection) => {
    args.state_handler!.init_variable(args.variable as string, args.default)
    return selection
      .append('select').attr('class', 'ds--select')
  },
  'render': (args, _selection, data, item) => {
    const dropdownData = data as DropdownItem[]
    const value = args.state_handler!.get_state()[args.variable as string]
    if (value === args.default && args.default === '~first') {
      args.state_handler!.set_variable(args.variable as string, dropdownData[0].value)
    }
    if (value === args.default && args.default === '~last') {
      args.state_handler!.set_variable(args.variable as string, dropdownData.slice(-1)[0].value)
    }

    item
      .selectAll('option').data(dropdownData).call(update_pattern)
    item
      .property('value', value)
    item
      .on('change', function(this: HTMLElement) {
        args.state_handler!.set_variable(args.variable as string, d3.select(this)
          .property('value'))
      })
  }
})

export default DropdownComponent
