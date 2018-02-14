import should from 'should' // eslint-disable-line no-unused-vars
import sinon from 'sinon'
import RootComponent from '../components/root/Root.js'
require('should-sinon')
import assert from 'assert'
import * as d3 from 'd3'


const parse_injector = require('inject-loader!./parser.js')
const fake_state_handler = sinon.spy()
const parse = parse_injector({
  '../state_handler.js': () => fake_state_handler
}).default

describe('Parser', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })


  it('should throw when called with empty object', () => {
    (() => {parse()({})}).should.throw('Argument \'component\' is required but not supplied.')
  })

  it('should throw error when argument is not an object', () => {
    (() => {parse()(42)}).should.throw('An object is required')
  })

  it('should throw when component name is invalid', () => {
    (() => {parse()({'component': 'bullshit component name'})}).should.throw('Argument \'component\' is invalid')
  })

  it('should throw when component does not exist', () => {
    (() => {
      const fake_component_loader = sinon.stub().throws(new Error('Component does not exist'))
      parse(fake_component_loader)({'component': 'AbsolutelyNonExistentComponent'})
    }).should.throw('Component does not exist')
  })

  it('parsing root component', () => {
    (() => {
      const fake_component_loader = sinon.stub().returns(sinon.spy())
      parse(fake_component_loader)({'component': 'root'})
    }).should.not.throw()
  })

  it('returns function', () => {
    const fake_component = sinon.spy()
    const fake_component_loader = sinon.stub().returns(fake_component)
    const component = parse(fake_component_loader)({'component': 'foo', 'args': {'magic': 42}})
    component.should.be.a.Function()
  })

  it('passes arguments to component', () => {
    const fake_component = sinon.stub().returns(sinon.stub().returns(sinon.spy()))
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = null
    const component = parse(fake_component_loader)({'component': 'foo', 'args': {'magic': 42}})
    component(my_selection)
    fake_component.should.be.calledWith({'magic': 42, 'state_handler': sinon.match.any})
  })

  it('passes state handler to root', () => {
    const fake_component = sinon.stub().returns(sinon.stub().returns(sinon.spy()))
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = null
    const component = parse(fake_component_loader)({'component': 'root', 'args': {'title': ''}})
    component(my_selection)
    fake_component.should.be.calledWith({
      'title': '',
      'state_handler': fake_state_handler
    })
  })

  it('loaded component is bound to the selection the wrapper is bound to', () => {
    const my_bind_function = sinon.stub().returns(sinon.spy())
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)({'component': 'foo', 'args': {'magic': 42}})
    component(my_selection)
    my_bind_function.should.be.calledWith(my_selection)
  })

  it('initial data is passed to update function when component is bound to selection', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)({'component': 'foo', 'data': [[1, 0], [2, 3]]})
    component(my_selection)
    my_update_function.should.be.calledWith([[1, 0], [2, 3]])
  })

  it('update function should be returned when binding to selection', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)({'component': 'foo', 'data': [[1, 0], [2, 3]]})
    const update = component(my_selection)
    update.should.be.a.Function()
  })

  it('update function should call original update function with correct arguments', () => {
    const my_update_function = sinon.spy()
    const my_bind_function = sinon.stub().returns(my_update_function)
    const fake_component = sinon.stub().returns(my_bind_function)
    const fake_component_loader = sinon.stub().returns(fake_component)
    const my_selection = {'rare': 'selection'}
    const component = parse(fake_component_loader)({'component': 'foo', 'data': [[1, 0], [2, 3]]})
    const update = component(my_selection)
    update([[2]])
    update.should.be.calledWith([[2]])
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
    bind(d3.selection())
    assert.equal(d3.selection().select('title').text(), 'Another example title')
  })
})
