import { vi } from 'vitest'
import sinon from 'sinon'
import * as d3 from 'd3'

const mocks = vi.hoisted(() => ({
  bb_generate: vi.fn() as any
}))

vi.mock('billboard.js', () => ({
  bb: { generate: (...args: any[]) => mocks.bb_generate(...args) }
}))

import ChartComponent from './Chart'

describe('ChartComponent', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  const call_render_with = (args: { component_args: any; render_args: any }) => {
    const fake_generate = sinon.spy()
    mocks.bb_generate = fake_generate
    const bind = ChartComponent(args.component_args)
    const selection = d3.selection()
    ;(selection as any).append = () => ({
      'node': () => 'magic',
      'attr': () => ({
        'node': () => 'magic',
      })
    })
    const render = bind(selection as any)
    render(args.render_args)

    return { fake_generate, selection }
  }

  it('billboard called', () => {
    const { fake_generate } = call_render_with({
      'component_args': {'type': 'spline'},
      'render_args': {'columns': [
        ['x', 1, 2, 3],
        ['y', 1, 2, 3],
      ]}
    })
    expect(fake_generate.called).toBe(true)
  })

  it('billboard called with correct arguments', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'spline'},
      'render_args': {'columns': [
        ['x', 1, 2, 3],
        ['y', 1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'spline',
        'columns': [
          ['x', 1, 2, 3],
          ['y', 1, 2, 3],
        ]
      }
    })).toBe(true)
  })

  it('billboard called with correct arguments 2', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie'},
      'render_args': {'columns': [
        ['a', 1, 2, 3],
        ['b', 1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'pie',
        'columns': [
          ['a', 1, 2, 3],
          ['b', 1, 2, 3],
        ]
      }
    })).toBe(true)
  })

  it('billboard called with correct arguments (stacked)', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'columns': [
        ['a', 1, 2, 3],
        ['b', 1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'pie',
        'groups': [['a', 'b']],
        'columns': [
          ['a', 1, 2, 3],
          ['b', 1, 2, 3],
        ]
      }
    })).toBe(true)
  })

  it('billboard called with correct arguments (horizontal)', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'axis': {'rotated': true}},
      'render_args': {'columns': [
        ['bar', 1, 2, 3],
        ['foo', 1, 2, 3],
        ['x', 1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'axis': {
        'rotated': true
      },
      'data': {
        'type': 'pie',
        'columns': [
          ['bar', 1, 2, 3],
          ['foo', 1, 2, 3],
          ['x', 1, 2, 3],
        ]
      }
    })).toBe(true)
  })

  it('billboard called with correct arguments (stacked 2)', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'columns': [
        ['bar', 1, 2, 3],
        ['foo', 1, 2, 3],
        ['x', 1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'pie',
        'groups': [['bar', 'foo', 'x']],
        'columns': [
          ['bar', 1, 2, 3],
          ['foo', 1, 2, 3],
          ['x', 1, 2, 3],
        ]
      }
    })).toBe(true)
  })

  it('billboard called with correct arguments (stacked, rows)', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'rows': [
        ['foo', 'bar'],
        [0, 1]
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'pie',
        'groups': [['foo', 'bar']],
        'rows': [
          ['foo', 'bar'],
          [0, 1]
        ]
      }
    })).toBe(true)
  })

  it('should take rows as well', () => {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'bar'},
      'render_args': {'rows': [
        [1, 2, 3],
        [1, 2, 3],
      ]}
    })
    expect(fake_generate.calledWith({
      'bindto': (selection as any).append().node(),
      'data': {
        'type': 'bar',
        'rows': [
          [1, 2, 3],
          [1, 2, 3],
        ]
      }
    })).toBe(true)
  })

})
