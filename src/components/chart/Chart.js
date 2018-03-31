import Component from '../base'
import { required } from '../../validators'
import './Chart.scss'


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
  'init': (args, selection) => selection
    .append('div').attr('class', 'ds--chart'),
  'render': (args, selection, data, element) => {
    const {bb} = require('billboard.js')
    const configuration = {
      'bindto': element.node(),
      'data': Object.assign(data, {'type': args.type})
    }
    if (args.stacked) {
      if (data.columns)
        configuration.data.groups = [data.columns.map(column => column[0])]
      if (data.rows)
        configuration.data.groups = [data.rows[0]]
    }
    if (args.axis) {
      configuration.axis = args.axis
    }
    bb.generate(configuration)
  }
})

export default ChartComponent
