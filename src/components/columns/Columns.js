import Component from '../base_component'
import default_parser from '../../default_parser.js'
import Wrapped from '../wrapped'
import './Columns.scss'

const ColumnsComponent = Wrapped((selection) =>
  selection.append('div').attr('class', 'ds--columns')
)(Component({
  'validators': [],
  'render': (args, selection, data) => {
    if (data instanceof Array) data.map((definition) => default_parser(definition)(selection))
  }

}))

export default ColumnsComponent
