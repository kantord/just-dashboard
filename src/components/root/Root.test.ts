import assert from 'node:assert'
import * as d3 from 'd3'
import sinon from 'sinon'
import { vi } from 'vitest'
import test_parser from '../../test_parser'

const mocks = vi.hoisted(() => ({
  parser: null as ((...args: any[]) => any) | null,
}))

vi.mock('../../default_parser', () => ({
  default: (...args: any[]) => {
    if (mocks.parser) return mocks.parser(...args)
    return () => {}
  },
}))

import RootComponent from './Root'

describe('Root component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title>foobar</title></head><body></body>'
    mocks.parser = null
  })

  const call_render_with = (args: any) => {
    if (args.parser) mocks.parser = args.parser
    const bind = RootComponent(args.component_args)
    const render = bind(d3.selection())
    render(args.render_args)
  }

  it('title text is set', () => {
    call_render_with({
      component_args: { title: 'My example title' },
    })
    assert.equal(d3.selection().select('title').text(), 'My example title')
  })

  it('render child element', () => {
    call_render_with({
      component_args: { title: "I don't care" },
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      render_args: [{ component: 'text', args: { tagName: 'h1' }, data: 'My title' }],
    })
    assert.equal(d3.selection().select('h1').text(), 'My title')
  })

  it('render child element only if there is a child', () => {
    call_render_with({
      component_args: { title: "I don't care" },
      render_args: [],
    })
    assert.equal(d3.selection().selectAll('h1').size(), 0)
  })

  it('render each child', () => {
    call_render_with({
      component_args: { title: "I don't care" },
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('h1').size(), 2)
  })

  it('renders parsed component', () => {
    call_render_with({
      component_args: { title: '' },
      parser: () => (selection: any) => selection.append('b').text(''),
      render_args: [{ component: 'text', args: { tagName: 'h1' }, data: 'My title' }],
    })
    assert.equal(d3.selection().selectAll('b').size(), 1)
  })

  it('integration test', async () => {
    const { default: realDefaultParser } = await vi.importActual<any>('../../default_parser')
    mocks.parser = realDefaultParser
    const bind = test_parser({
      component: 'root',
      args: {
        title: 'Another example title',
      },
      data: [
        {
          component: 'text',
          args: { tagName: 'p' },
          data: 'Almafa',
        },
      ],
    } as any)
    bind(d3.selection())
    assert.equal(d3.selection().select('body p').text(), 'Almafa')
  })

  it('children are wrapped in child wrapper', () => {
    call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('.ds--wrapper').size(), 2)
  })

  it('variables are initialized in state', () => {
    const state_handler = { init_variable: sinon.spy(), reset: sinon.spy() }
    const my_default = sinon.spy()
    call_render_with({
      parser: (component: any) => () =>
        component.args.state_handler.init_variable(component.args.variable, component.args.default),
      component_args: { title: 'x', state_handler: state_handler },
      render_args: [
        {
          component: 'dropdown',
          args: {
            default: my_default,
            variable: 'foo',
          },
          data: [],
        },
      ],
    })
    expect(state_handler.init_variable.calledWith('foo', my_default)).toBe(true)
  })

  it("calls state_handler's reset", () => {
    const state_handler = { reset: sinon.spy() }
    call_render_with({
      parser: (component: any) => () =>
        component.args.state_handler.init_variable(component.args.variable, component.args.default),
      component_args: { title: 'x', state_handler: state_handler },
      render_args: [
        {
          component: 'dropdown',
          args: {
            default: sinon.spy(),
            variable: 'foo',
          },
          data: [],
        },
      ],
    })
    expect(state_handler.reset.called).toBe(true)
  })

  it('variables are updated in state', () => {
    const state_handler = { set_variable: sinon.spy(), reset: sinon.spy() }
    call_render_with({
      parser: (component: any) => () =>
        component.args.state_handler.set_variable(component.args.variable, component.args.default),
      component_args: { title: 'x', state_handler: state_handler },
      render_args: [
        {
          component: 'dropdown',
          args: {
            default: sinon.spy(),
            variable: 'foo',
          },
          data: [],
        },
      ],
    })
    expect(state_handler.set_variable.calledWith('foo', sinon.match.any)).toBe(true)
  })

  it('superflous elements are removed', () => {
    d3.select('body').append('div').attr('class', 'ds--wrapper')
    call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('.ds--wrapper').size(), 2)
  })

  it('doesnt fail when component has no explicit args', () => {
    d3.select('body').append('div').attr('class', 'ds--wrapper')
    call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      render_args: [{ component: 'text', data: 'My title' }],
    })
  })
})
