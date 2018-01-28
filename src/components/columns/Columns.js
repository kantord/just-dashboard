import ContainerComponent from '../container_base.js'
import Wrapped from '../wrapped'
import './Columns.scss'

const ColumnsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--columns')
  .attr('data-ds--columns', ((args === undefined || args.columns === undefined) ? 2 : args.columns))
)(ContainerComponent({
  'wrapper_tag': 'div',
  'wrapper_class': 'ds--column'
}))

export default ColumnsComponent
