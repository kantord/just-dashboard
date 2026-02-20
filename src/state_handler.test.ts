import sinon from 'sinon'
import { vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  isEqual: null as ((...args: unknown[]) => boolean) | null,
}))

vi.mock('fast-deep-equal', async () => {
  const actual = await vi.importActual<{ default: (...args: unknown[]) => boolean }>('fast-deep-equal')
  return {
    default: (...args: unknown[]) => (mocks.isEqual ? mocks.isEqual(...args) : actual.default(...args)),
  }
})

import create_state_handler from './state_handler'

describe('state handler', () => {
  beforeEach(() => {
    mocks.isEqual = null
  })

  it('has a get_state method', () => {
    expect(create_state_handler()).toHaveProperty('get_state')
  })

  it('has a set_variable method', () => {
    expect(create_state_handler()).toHaveProperty('set_variable')
  })

  it('has an init_variable method', () => {
    expect(create_state_handler()).toHaveProperty('init_variable')
  })

  it('has empty initial state', () => {
    expect(create_state_handler().get_state()).toEqual({})
  })

  it('init_variable should update state', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('foo', 42)
    expect(state_handler.get_state()).toEqual({
      foo: 42,
    })
  })

  it('init_variable should update state 2', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('bar', false)
    state_handler.init_variable('pi', 3.14)
    expect(state_handler.get_state()).toEqual({
      bar: false,
      pi: 3.14,
    })
  })

  it('init_variable does not update state if variable is defined', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('bar', false)
    state_handler.init_variable('pi', 3.14)
    state_handler.init_variable('pi', -3.14)
    expect(state_handler.get_state()).toEqual({
      bar: false,
      pi: 3.14,
    })
  })

  it('set_variable should update state', () => {
    const state_handler = create_state_handler()
    state_handler.set_variable('foo', 42)
    expect(state_handler.get_state()).toEqual({
      foo: 42,
    })
  })

  it('set_variable should update state 2', () => {
    const state_handler = create_state_handler()
    state_handler.set_variable('bar', false)
    state_handler.set_variable('pi', 3.14)
    expect(state_handler.get_state()).toEqual({
      bar: false,
      pi: 3.14,
    })
  })

  it('has a subscribe method', () => {
    expect(typeof create_state_handler().subscribe).toBe('function')
  })

  it('has a reset method', () => {
    expect(typeof create_state_handler().reset).toBe('function')
  })

  it('reset() undoes subscriptions', () => {
    const my_callback = sinon.spy()
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.reset()
    state_handler.set_variable('foo', 42)
    expect(my_callback.called).toBe(false)
  })

  const methods_that_update_state = ['init_variable', 'set_variable'] as const

  methods_that_update_state.forEach((method) => {
    it(`callback should be called when variables change - ${method}`, () => {
      const my_callback = sinon.spy()
      const state_handler = create_state_handler()
      state_handler.subscribe(my_callback)
      state_handler[method]('foo', 42)
      expect(my_callback.calledWith(state_handler, my_callback)).toBe(true)
    })

    it(`callback not called when no actual change happens - ${method}`, () => {
      const my_callback = sinon.spy()
      mocks.isEqual = () => true
      const state_handler = create_state_handler()
      state_handler.subscribe(my_callback)
      state_handler[method]('foo', 42)
      expect(my_callback.called).toBe(false)
    })

    it(`callback should retrieve collect state - ${method}`, () => {
      let retrieved_state = null
      const my_callback = (handler: any) => {
        retrieved_state = Object.assign({}, handler.get_state())
      }
      const state_handler = create_state_handler()
      state_handler.subscribe(my_callback)
      state_handler[method]('foo', 42)
      expect(retrieved_state).toEqual({ foo: 42 })
    })
  })

  it('callback should not be called again without re-subscribe', () => {
    const my_callback = sinon.spy()
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.set_variable('foo', 42)
    state_handler.set_variable('foo', 42)
    expect(my_callback.calledOnce).toBe(true)
  })

  it('no state change if init_variable called 2x on the same variable', () => {
    const my_callback = sinon.spy(() => {
      state_handler.subscribe(my_callback)
    })
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.init_variable('foo', 42)
    state_handler.init_variable('foo', 42)
    expect(my_callback.calledOnce).toBe(true)
  })

  it('callback should be called again with re-subscribe', () => {
    const my_callback = sinon.spy(() => {
      state_handler.subscribe(my_callback)
    })
    mocks.isEqual = () => false
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.set_variable('foo', 42)
    state_handler.set_variable('foo', 42)
    expect(my_callback.calledTwice).toBe(true)
  })
})
