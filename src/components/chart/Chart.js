import Component from '../base_component.js'
import { required } from '../../validators'

const ChartComponent = Component({
  'validators': [required('type')],
  'render': (args, selection, data) => {
    const {bb} = require('billboard.js')
    const element = selection.append('div')
    bb.generate({
      'bindto': element.node(),
      'data': {
        'type': args.type,
        'columns': data.columns
      }
    })
  }
})

export default ChartComponent
