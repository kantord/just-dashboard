import create_state_handler from './state_handler.js'
import sinon from 'sinon'


describe('state handler', () => {
  it('has a get_state method', () => {
    create_state_handler().should.have.property('get_state')
  })

  it('has a set_variable method', () => {
    create_state_handler().should.have.property('set_variable')
  })

  it('has an init_variable method', () => {
    create_state_handler().should.have.property('init_variable')
  })

  it('has empty initial state', () => {
    create_state_handler().get_state().should.deepEqual({})
  })

  it('init_variable should update state', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('foo', 42)
    state_handler.get_state().should.deepEqual({
      'foo': 42
    })
  })

  it('init_variable should update state 2', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('bar', false)
    state_handler.init_variable('pi', 3.14)
    state_handler.get_state().should.deepEqual({
      'bar': false,
      'pi': 3.14
    })
  })

  it('init_variable does not update state if variable is defined', () => {
    const state_handler = create_state_handler()
    state_handler.init_variable('bar', false)
    state_handler.init_variable('pi', 3.14)
    state_handler.init_variable('pi', -3.14)
    state_handler.get_state().should.deepEqual({
      'bar': false,
      'pi': 3.14
    })
  })

  it('set_variable should update state', () => {
    const state_handler = create_state_handler()
    state_handler.set_variable('foo', 42)
    state_handler.get_state().should.deepEqual({
      'foo': 42
    })
  })

  it('set_variable should update state 2', () => {
    const state_handler = create_state_handler()
    state_handler.set_variable('bar', false)
    state_handler.set_variable('pi', 3.14)
    state_handler.get_state().should.deepEqual({
      'bar': false,
      'pi': 3.14
    })
  })
  
  it('has a subscribe method', () => {
    create_state_handler().subscribe.should.be.a.Function()
  })

  const methods_that_update_state = ['init_variable', 'set_variable']

  methods_that_update_state.forEach(method => {
    it(`callback should be called when variables change - ${method}`, () => {
      const my_callback = sinon.spy()
      const state_handler = create_state_handler()
      state_handler.subscribe(my_callback)
      state_handler[method]('foo', 42)
      my_callback.should.be.calledWith(state_handler, my_callback)
    })

    it(`callback should retrieve collect state - ${method}`, () => {
      let retrieved_state = null
      const my_callback = (handler) => {
        retrieved_state = Object.assign({}, handler.get_state())}
      const state_handler = create_state_handler()
      state_handler.subscribe(my_callback)
      state_handler[method]('foo', 42)
      retrieved_state.should.deepEqual({'foo': 42})
    })
  })

  it('callback should not be called again without re-subscribe', () => {
    const my_callback = sinon.spy()
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.set_variable('foo', 42)
    state_handler.set_variable('foo', 42)
    my_callback.should.be.calledOnce()
  })

  it('no state change if init_variable is called twice on the same variable', () => {
    const my_callback = sinon.spy(function() {state_handler.subscribe(my_callback)})
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.init_variable('foo', 42)
    state_handler.init_variable('foo', 42)
    my_callback.should.be.calledOnce()
  })

  it('callback should be called again with re-subscribe', () => {
    const my_callback = sinon.spy(function() {state_handler.subscribe(my_callback)})
    const state_handler = create_state_handler()
    state_handler.subscribe(my_callback)
    state_handler.set_variable('foo', 42)
    state_handler.set_variable('foo', 42)
    my_callback.should.be.calledTwice()
  })

})
