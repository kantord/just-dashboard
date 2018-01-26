import ContainerComponent from '../container_base.js'
import Wrapped from '../wrapped'

const RowsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--rows')
)(ContainerComponent({
  'wrapper_tag': 'div',
  'wrapper_class': 'ds--row'
}))

export default RowsComponent
