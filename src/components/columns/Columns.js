import Component from '../base_component'
import default_parser from '../../default_parser.js'
import Wrapped from '../wrapped'
import './Columns.scss'

const ColumnsComponent = Wrapped((args, selection) => selection
  .append('div')
  .attr('class', 'ds--columns')
  .attr('data-ds--columns', ((args === undefined || args.columns === undefined) ? 2 : args.columns)
  )
)(Component({
  'validators': [],
  'render': (args, selection, data) => {
    if (data instanceof Array) data.map((definition) => {
      const wrapper = selection
        .append('div')
        .attr('class', 'ds--column')
      default_parser(definition)(wrapper)
    })
  }

}))

export default ColumnsComponent
