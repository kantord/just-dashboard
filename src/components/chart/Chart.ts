import * as Plot from '@observablehq/plot'
import { required } from '../../validators'
import Component from '../base'
import './Chart.scss'

const createMark = (type: string, data: Record<string, unknown>[], stacked: boolean, rotated: boolean) => {
  const markOptions: Record<string, unknown> = rotated ? { y: 'x', x: 'y' } : { x: 'x', y: 'y' }

  if (stacked) {
    Object.assign(markOptions, Plot.stackY())
  }

  switch (type) {
    case 'bar':
      return rotated ? Plot.barX(data, markOptions) : Plot.barY(data, markOptions)
    case 'line':
      return Plot.lineY(data, markOptions)
    case 'spline':
      return Plot.lineY(data, { ...markOptions, curve: 'catmull-rom' })
    case 'area':
      return Plot.areaY(data, markOptions)
    case 'step':
      return Plot.lineY(data, { ...markOptions, curve: 'step' })
    case 'scatter':
      return Plot.dot(data, markOptions)
    case 'bubble':
      return Plot.dot(data, { ...markOptions, r: 'r' })
    default:
      return Plot.barY(data, markOptions)
  }
}

const ChartComponent = Component({
  validators: [required('type')],
  init: (_args, selection) => selection.append('div').attr('class', 'ds--chart'),
  render: (args, _selection, data, element) => {
    element.selectAll('*').remove()
    const plotData = data as Record<string, unknown>[]
    const rotated = !!(args.axis && (args.axis as Record<string, unknown>).rotated)
    const mark = createMark(args.type as string, plotData, !!args.stacked, rotated)

    const plotOptions: Record<string, unknown> = { marks: [mark] }

    if (args.axis) {
      const axisConfig = args.axis as Record<string, unknown>
      if (axisConfig.x) plotOptions.x = axisConfig.x
      if (axisConfig.y) plotOptions.y = axisConfig.y
    }

    const svg = Plot.plot(plotOptions)
    element.node()?.appendChild(svg)
  },
})

export default ChartComponent
