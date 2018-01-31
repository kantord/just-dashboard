import ContainerComponent from '../container_base.js'
import Wrapped from '../wrapped'

/**
 * Useful for grouping elements in a vertical layout. Similar to RootComponent,
 * but doesn't alter the `<title>` tag.
 * @module components/rows
 * @param args Component arguments
 * @param args.tagName HTML tag name (i.e. div, p, h1, h2, etc.)
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * rows:
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "rows",
 *   "data": [...]
 * }
 *
 * @example <caption>JavaScript format</caption>
 * import RowsComponent from 'components/rows'
 *
 * RowsComponent({'tagName': 'p'})(d3.selection())(...)
 */
const RowsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--rows')
)(ContainerComponent({
  'wrapper_tag': 'div',
  'wrapper_class': 'ds--row'
}))

export default RowsComponent
