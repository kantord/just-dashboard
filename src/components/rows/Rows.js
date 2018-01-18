import Component from '../base_component'
import default_parser from '../../default_parser.js'
import Wrapped from '../wrapped'
//import './Rows.scss'

const RowsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--rows')
)(Component({
  'validators': [],
  'render': (args, selection, data) => {
    if (data instanceof Array) data.map((definition) => {
      const wrapper = selection
        .append('div')
        .attr('class', 'ds--row')
      default_parser(definition)(wrapper)
    })
  }

}))

export default RowsComponent
