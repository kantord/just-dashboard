import * as d3 from 'd3'
//import {bb} from "billboard.js"

const ChartComponent = (args) => (selection) => (data) => {
  if (!args.hasOwnProperty('type')) throw new Error('Type required')
  if (!(selection instanceof d3.selection)) throw new Error('A d3 selection is required')
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

export default ChartComponent
