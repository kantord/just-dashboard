import assert from 'node:assert'
import * as d3 from 'd3'
import sinon from 'sinon'
import { vi } from 'vitest'
import test_parser from '../test_parser'

const mocks = vi.hoisted(() => ({
  parser: null as ((...args: any[]) => any) | null,
  componentSpy: null as ((...args: any[]) => void) | null,
}))

vi.mock('../default_parser', () => ({
  default: (...args: any[]) => {
    if (mocks.parser) return mocks.parser(...args)
    return () => {}
  },
}))

vi.mock('./base', async () => {
  const actual = await vi.importActual<any>('./base')
  return {
    default: (...args: any[]) => {
      if (mocks.componentSpy) mocks.componentSpy(...args)
      return actual.default(...args)
    },
  }
})

import ContainerComponent from './container_base'

describe('base container component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title>foobar</title></head><body></body>'
    mocks.parser = null
    mocks.componentSpy = null
  })

  const call_render_with = (args: any) => {
    const my_component_func = sinon.spy()
    mocks.componentSpy = my_component_func
    if (args.parser) mocks.parser = args.parser
    const my_component = ContainerComponent({
      wrapper_tag: args.wrapper_tag,
      wrapper_class: args.wrapper_class,
      validators: args.validators,
      init: args.init,
    })
    const bind = my_component(args.component_args)
    const render = bind(d3.selection())
    render(args.render_args)

    return { my_component_func, render }
  }

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
    const { default: realDefaultParser } = await vi.importActual<any>('../default_parser')
    mocks.parser = realDefaultParser
    mocks.componentSpy = null
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
      wrapper_tag: 'div',
      wrapper_class: 'foo',
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('div.foo').size(), 2)
  })

  it('children are wrapped in child wrapper 2', () => {
    call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      wrapper_tag: 'span',
      wrapper_class: 'bar',
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('span.bar').size(), 2)
  })

  it('calls components with actual validators', () => {
    const my_validators = [sinon.spy()]
    const { my_component_func } = call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      wrapper_tag: 'span',
      wrapper_class: 'bar',
      validators: my_validators,
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    expect(
      my_component_func.calledWith({
        render: sinon.match.any,
        init: sinon.match.any,
        validators: my_validators,
      }),
    ).toBe(true)
  })

  it('calls component with actual init function', () => {
    const my_init = sinon.spy()
    const { my_component_func } = call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      wrapper_tag: 'span',
      wrapper_class: 'bar',
      init: my_init,
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    expect(
      my_component_func.calledWith({
        render: sinon.match.any,
        init: my_init,
        validators: sinon.match.any,
      }),
    ).toBe(true)
  })

  it('only new component is visible after second render', () => {
    const { render } = call_render_with({
      parser: (component: any) => (selection: any) => selection.append(component.component),
      component_args: { title: '' },
      wrapper_tag: 'span',
      wrapper_class: 'bar',
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('text').size(), 2)
    render([{ component: 'text2', args: {}, data: null }])
    assert.equal(d3.selection().selectAll('text2').size(), 1)
    assert.equal(d3.selection().selectAll('text').size(), 0)
  })

  it('passes on state_handler', () => {
    const fake_parser = sinon.stub().returns(sinon.spy())
    const state_handler = sinon.spy()
    call_render_with({
      parser: fake_parser,
      component_args: { title: '', state_handler: state_handler },
      render_args: [{ component: 'text', data: 'My title' }],
    })
    expect(
      fake_parser.calledWith({
        component: sinon.match.any,
        args: { state_handler: state_handler, file_loader: sinon.match.any },
        data: sinon.match.any,
      }),
    ).toBe(true)
  })

  it('passes on file_loader', () => {
    const fake_parser = sinon.stub().returns(sinon.spy())
    const file_loader = sinon.spy()
    call_render_with({
      parser: fake_parser,
      component_args: { title: '', file_loader: file_loader },
      render_args: [{ component: 'text', data: 'My title' }],
    })
    expect(
      fake_parser.calledWith({
        component: sinon.match.any,
        args: { file_loader: file_loader, state_handler: sinon.match.any },
        data: sinon.match.any,
      }),
    ).toBe(true)
  })

  it('superfluous elements are removed', () => {
    d3.selection().append('h1')
    call_render_with({
      parser: () => (selection: any) => selection.append('h1').text('My title'),
      component_args: { title: '' },
      wrapper_tag: 'span',
      wrapper_class: 'bar',
      render_args: [
        { component: 'text', args: { tagName: 'h1' }, data: 'My title' },
        { component: 'text', args: { tagName: 'h2' }, data: 'My secondary header' },
      ],
    })
    assert.equal(d3.selection().selectAll('h1').size(), 2)
  })
})
