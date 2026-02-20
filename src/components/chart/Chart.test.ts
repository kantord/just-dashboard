import * as d3 from 'd3'
import ChartComponent from './Chart'

describe('ChartComponent', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  const renderChart = (componentArgs: Record<string, unknown>, data: unknown) => {
    const bind = ChartComponent(componentArgs)
    const render = bind(d3.selection())
    render(data)
    return d3.selection()
  }

  it('renders an SVG element', () => {
    renderChart({ type: 'bar' }, [
      { x: 'Apples', y: 3 },
      { x: 'Oranges', y: 2 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a bar chart', () => {
    renderChart({ type: 'bar' }, [
      { x: 'Apples', y: 3 },
      { x: 'Oranges', y: 2 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a line chart', () => {
    renderChart({ type: 'line' }, [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a scatter chart', () => {
    renderChart({ type: 'scatter' }, [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a stacked bar chart', () => {
    renderChart({ type: 'bar', stacked: true }, [
      { x: 'A', y: 1 },
      { x: 'A', y: 2 },
      { x: 'B', y: 3 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('re-rendering replaces previous chart', () => {
    const bind = ChartComponent({ type: 'bar' })
    const render = bind(d3.selection())
    render([{ x: 'A', y: 1 }])
    render([{ x: 'B', y: 2 }])
    expect(d3.selection().selectAll('.ds--chart svg').size()).toBe(1)
  })

  it('renders an area chart', () => {
    renderChart({ type: 'area' }, [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a step chart', () => {
    renderChart({ type: 'step' }, [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a spline chart', () => {
    renderChart({ type: 'spline' }, [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('renders a bubble chart', () => {
    renderChart({ type: 'bubble' }, [
      { x: 1, y: 2, r: 5 },
      { x: 3, y: 4, r: 10 },
    ])
    expect(d3.selection().select('.ds--chart svg').size()).toBe(1)
  })

  it('should throw on missing type', () => {
    expect(() => {
      ChartComponent({} as any)
    }).toThrow("Argument 'type' is required but not supplied.")
  })
})
