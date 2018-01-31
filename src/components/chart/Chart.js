import Component from '../base_component.js'
import { required } from '../../validators'
/**
 * Creates a visualization
 * @module components/chart
 * @param args Component arguments
 * @param args.type Visualization type (`pie`, `bar`, `line`, etc.)
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * pie chart:
 *   ...
 *
 * @example
 * bar chart:
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "chart",
 *   "args": {"type": "pie"},
 *   "data": [...]
 * }
 *
 * @example <caption>JavaScript format</caption>
 * import ChartComponent from 'components/chart'
 *
 * ChartComponent({'type': 'pie'})(d3.selection())(...)
 *
 *
 */
const ChartComponent = Component({
  'validators': [required('type')],
  'render': (args, selection, data) => {
    const {bb} = require('billboard.js')
    const element = selection.append('div')
    bb.generate({
      'bindto': element.node(),
      'data': Object.assign(data, {'type': args.type})
    })
  }
})

export default ChartComponent
