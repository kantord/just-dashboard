import { vi } from 'vitest'
import sinon from 'sinon'
import RootComponent from '../components/root/Root'
import assert from 'assert'
import * as d3 from 'd3'

const mocks = vi.hoisted(() => ({
  fake_state_handler: null as any
}))

vi.mock('../state_handler', () => ({
  default: () => mocks.fake_state_handler
}))

import parse from './parser'

describe('Parser', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
    mocks.fake_state_handler = sinon.spy()
  })

  it('should throw when called with empty object', () => {
    expect(() => { (parse as any)()({}) })
      .toThrow('Argument \'component\' is required but not supplied.')
  })

  it('should throw error when argument is not an object', () => {
    expect(() => { (parse as any)()(42 as any) }).toThrow('An object is required')
  })

  it('should throw when component name is invalid', () => {
    expect(() => { (parse as any)()({'component': 'bullshit component name'}) })
      .toThrow('Argument \'component\' is invalid')
  })

  it('should throw when component does not exist', () => {
    expect(() => {
      const fake_component_loader = sinon.stub()
        .throws(new Error('Component does not exist'))
      parse(fake_component_loader)(
        {'component': 'AbsolutelyNonExistentComponent'})
    }).toThrow('Component does not exist')
  })

  it('parsing root component', () => {
    expect(() => {
      const fake_component_loader = sinon.stub().returns(sinon.spy())
      parse(fake_component_loader)({'component': 'root'})
    }).not.toThrow()
  })

  it('returns function', () => {
    const fake_component = sinon.spy()
    const fake_component_loader = sinon.stub().returns(fake_component)
    const component = parse(fake_component_loader)(
      {'component': 'foo', 'args': {'magic': 42}})
    expect(typeof component).toBe('function')
  })

  it('passes state handler to root', () => {
    const fake_component = sinon.stub().returns(
      sinon.stub().returns(sinon.spy()))
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = null
    const component = parse(fake_component_loader)(
      {'component': 'root', 'args': {'title': ''}})
    component(my_selection as any)
    expect(fake_component.calledWith({
      'title': '',
      'state_handler': mocks.fake_state_handler,
      'file_loader': sinon.match.any
    })).toBe(true)
  })

  it('passes file_loader to root', () => {
    const fake_component = sinon.stub().returns(
      sinon.stub().returns(sinon.spy()))
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = null
    const my_file_loader = sinon.spy()
    const component = parse(fake_component_loader)(
      {'component': 'root', 'args': {'title': ''}}, my_file_loader as any)
    component(my_selection as any)
    expect(fake_component.calledWith({
      'title': '',
      'state_handler': sinon.match.any,
      'file_loader': my_file_loader,
    })).toBe(true)
  })

  it('only passes state handler to root', () => {
    const fake_component = sinon.stub().returns(
      sinon.stub().returns(sinon.spy()))
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = null
    const component = parse(fake_component_loader)(
      {'component': 'text', 'args': {'tagName': 'p'}})
    component(my_selection as any)
    expect(fake_component.calledWith({
      'tagName': 'p',
    })).toBe(true)
  })

  it('loaded component bound to the selection the wrapper is bound to', () => {
    const my_bind_function = sinon.stub().returns(sinon.spy())
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)(
      {'component': 'foo', 'args': {'magic': 42}})
    component(my_selection as any)
    expect(my_bind_function.calledWith(my_selection)).toBe(true)
  })

  it('initial data passed to update when component bound to selection', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)(
      {'component': 'foo', 'data': [[1, 0], [2, 3]]})
    component(my_selection as any)
    expect(my_update_function.calledWith([[1, 0], [2, 3]])).toBe(true)
  })

  it('update function should be returned when binding to selection', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)(
      {'component': 'foo', 'data': [[1, 0], [2, 3]]})
    const update = component(my_selection as any)
    expect(typeof update).toBe('function')
  })

  it('update function calls original update with correct arguments', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)(
      {'component': 'foo', 'data': [[1, 0], [2, 3]]})
    const update = component(my_selection as any)
    update([[2]])
    expect(my_update_function.calledWith([[2]])).toBe(true)
  })

  it('integration with RootComponent', () => {
    document.head.innerHTML = '<title>foobar</title>'
    const fake_component_loader = sinon.stub().returns(RootComponent)
    const bind = parse(fake_component_loader)({
      'component': 'root',
      'args': {
        'title': 'Another example title'
      },
      'data': []
    })
    bind(d3.selection() as any)
    assert.equal(d3.selection().select('title').text(), 'Another example title')
  })
})
