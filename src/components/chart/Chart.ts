import Component from '../base'
import { required } from '../../validators'
import { bb } from 'billboard.js'
import './Chart.scss'

const ChartComponent = Component({
  'validators': [required('type')],
  'init': (args, selection) => selection
    .append('div').attr('class', 'ds--chart'),
  'render': (args, _selection, data, element) => {
    const chartData = data as Record<string, unknown>
    const configuration: Record<string, unknown> = {
      'bindto': element.node(),
      'data': Object.assign(chartData, {'type': args.type})
    }
    if (args.stacked) {
      const dataObj = configuration.data as Record<string, unknown>
      if ((chartData as any).columns)
        dataObj.groups = [(chartData as any).columns.map((column: unknown[]) => column[0])]
      if ((chartData as any).rows)
        dataObj.groups = [(chartData as any).rows[0]]
    }
    if (args.axis) {
      configuration.axis = args.axis
    }
    bb.generate(configuration as any)
  }
})

export default ChartComponent
