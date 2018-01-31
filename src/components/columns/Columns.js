import ContainerComponent from '../container_base.js'
import Wrapped from '../wrapped'
import './Columns.scss'

/**
 * Useful for grouping elements in a horizontal layout. Similar to
 * Columns, but the elements are aligned in columns.
 * @module components/columns
 * @param args Component arguments
 * @param [args.columns=2] Ideal number of columns. Might be reduced on smaller
 * screens.
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * columns:
 *   ...
 *
 * @example
 * 4 columns:
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "columns",
 *   "data": [...]
 * }
 *
 * @example
 * {
 *   "component": "columns",
 *   "args": {"columns": 4},
 *   "data": [...]
 * }
 * @example <caption>JavaScript format</caption>
 * import ColumnsComponent from 'components/columns'
 *
 * ColumnsComponent({})(d3.selection())(...)
 *
 * @example
 * import ColumnsComponent from 'components/columns'
 *
 * ColumnsComponent({'columns': '4'})(d3.selection())(...)

 */
const ColumnsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--columns')
  .attr('data-ds--columns', ((args === undefined || args.columns === undefined) ? 2 : args.columns))
)(ContainerComponent({
  'wrapper_tag': 'div',
  'wrapper_class': 'ds--column'
}))

export default ColumnsComponent
