import ContainerComponent from '../container_base'
import Wrapped from '../wrapped'
import './Board.scss'

const BoardComponent = Wrapped((_args, selection) => selection.append('div').attr('class', 'ds--board'))(
  ContainerComponent({
    wrapper_tag: 'div',
  }),
)

export default BoardComponent
