import assert from 'node:assert'
import * as d3 from 'd3'
import sinon from 'sinon'
import Wrapped from './wrapped'

describe('Wrapped', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  const call_render_with = () => {
    const selection = d3.selection()
    const render = sinon.stub()
    const wrapped_selection = 'masdfsdafdsf'
    const wrapper = sinon.stub().returns(wrapped_selection)
    const fake_render = sinon.spy()
    const fake_bind = sinon.stub().returns(fake_render)
    const fake_component = sinon.stub().returns(fake_bind)
    const wrapped_component = Wrapped(wrapper as any)(fake_component as any)
    const args = { '42': 'abc' }
    const wrapped_render = wrapped_component(args)(selection)
    wrapped_render(undefined as any)

    return {
      selection,
      render,
      wrapper,
      fake_bind,
      wrapped_selection,
      args,
      fake_component,
      wrapped_render,
      fake_render,
    }
  }

  it('requires wrapper function', () => {
    expect(() => {
      ;(Wrapped as any)()(undefined as any)
    }).toThrow('Invalid wrapper function')
  })

  it('requires component to wrap', () => {
    expect(() => {
      Wrapped((() => null) as any)(undefined as any)
    }).toThrow('A component is required')
  })

  it('accepts function as component', () => {
    expect(() => {
      Wrapped((() => null) as any)((() => null) as any)
    }).not.toThrow('A component is required')
  })

  it('returns a component', () => {
    const wrapped_component = Wrapped((() => null) as any)((() => () => () => null) as any)
    expect(typeof wrapped_component).toBe('function')
    expect(typeof wrapped_component({} as any)).toBe('function')
    expect(typeof wrapped_component({} as any)(null as any)).toBe('function')
  })

  it('wrapper function called with selection', () => {
    const { wrapper, selection, args } = call_render_with()
    expect(wrapper.calledWith(args, selection)).toBe(true)
  })

  it('bind is called with wrapped selection', () => {
    const { fake_bind, wrapped_selection } = call_render_with()
    expect(fake_bind.calledWith(wrapped_selection)).toBe(true)
  })

  it('should be called with correct args', () => {
    const { args, fake_component } = call_render_with()
    expect(fake_component.calledWith(args)).toBe(true)
  })

  it('should return correct render function', () => {
    const { fake_render, wrapped_render } = call_render_with()
    assert.equal(fake_render, wrapped_render)
  })
})
