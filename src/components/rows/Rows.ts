import ContainerComponent from '../container_base'
import Wrapped from '../wrapped'
import './Rows.scss'

const RowsComponent = Wrapped((_args, selection) => selection.append('div').attr('class', 'ds--rows'))(
  ContainerComponent({
    wrapper_tag: 'div',
    wrapper_class: 'ds--row',
  }),
)

export default RowsComponent
