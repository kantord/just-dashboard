import Component from '../base_component.js'
import * as d3 from 'd3'

const ChartComponent = Component({
  "validators": [
    (args) => {if (!args.hasOwnProperty('type')) throw new Error('Type required')}
  ],
  "render": (args, selection, data) => {
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
