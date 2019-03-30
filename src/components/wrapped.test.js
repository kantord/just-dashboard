import should from 'should' // eslint-disable-line no-unused-vars
import sinon from 'sinon'
import Wrapped from './wrapped'
import assert from 'assert'

describe('Wrapped', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')(undefined, {'url': 'https://fake.url.com'})
  })

  afterEach(function () {
    this.jsdom()
  })

  const call_render_with = () => {
    const d3 = require('d3')
    const selection = d3.selection()
    const render = sinon.stub()
    const wrapped_selection = 'masdfsdafdsf'
    const wrapper = sinon.stub().returns(wrapped_selection)
    const fake_render = sinon.spy()
    const fake_bind = sinon.stub().returns(fake_render)
    const fake_component = sinon.stub().returns(fake_bind)
    const wrapped_component = Wrapped(wrapper)(fake_component)
    const args = {'42': 'abc'}
    const wrapped_render = wrapped_component(args)(selection)
    wrapped_render()

    return { selection, render, wrapper, fake_bind, wrapped_selection, args,
      fake_component, wrapped_render, fake_render }
  }

  it('requires wrapper function', function() {
    (() => {
      Wrapped()()
    }).should.throw('Invalid wrapper function')
  })

  it('requires component to wrap', function() {
    (() => {
      Wrapped(() => null)()
    }).should.throw('A component is required')
  })

  it('accepts function as component', function() {
    (() => {
      Wrapped(() => null)(() => null)
    }).should.not.throw('A component is required')
  })

  it('returns a component', () => {
    const wrapped_component = Wrapped(() => null)(() => () => () => null)
    wrapped_component.should.be.a.Function()
    wrapped_component({}).should.be.a.Function() // bind
    wrapped_component({})(null).should.be.a.Function() //render
  })

  it('wrapper function called with selection', function() {
    const { wrapper, selection, args } = call_render_with()
    wrapper.should.be.calledWith(args, selection)
  })

  it('bind is called with wrapped selection', function() {
    const { fake_bind, wrapped_selection } = call_render_with()
    fake_bind.should.be.calledWith(wrapped_selection)
  })

  it('should be called with correct args', function() {
    const { args, fake_component } = call_render_with()
    fake_component.should.be.calledWith(args)
  })

  it('should return correct render function', function() {
    const { fake_render, wrapped_render } = call_render_with()
    assert.equal(fake_render, wrapped_render)
  })

})
