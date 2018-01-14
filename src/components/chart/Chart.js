import Component from '../base_component.js'
import { required } from '../../validators'

const ChartComponent = Component({
  'validators': [required('type')],
  'render': (args, selection, data) => {
    const {bb} = require('billboard.js')
    const element = selection.append('div')
    bb.generate({
      'bindto': element.node(),
      'data': Object.assign(data, {'type': args.type})
    })
  }
})

export default ChartComponent
