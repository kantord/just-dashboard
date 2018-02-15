import Component from './base_component'
import sinon from 'sinon'
import assert from 'assert'
import * as d3 from 'd3'

describe('Component', function() {

  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  const call_test_component_with = (args) => {
    const injector = require('inject-loader!./base_component.js')
    const jq = sinon.stub().returns(
      (args.dont_execute_query === true) ? {'then': () => null}
        : {'then': (x) => x(args.jq_return_value)}
    )
    const format_value = sinon.stub()
      .onCall(0).returns(args.format_value_return)
      .returns(args.format_value_return2)
    const Component = injector({
      '../jq-web.js': jq,
      '../interpolation.js': {'format_value': format_value}
    }).default

    const my_init = sinon.stub()
      .onCall(1).returns(args.element2)
      .returns(args.element)
    const my_render = (args.render_func === undefined ) ? sinon.spy() : args.render_func
    const my_component = (args.has_init === true) ? Component({
      'render': my_render, 'validators': [], 'init': my_init
    }) : Component({
      'render': my_render, 'validators': []
    })
    const bind = my_component(args.instance_args)
    const d3 = require('d3')
    const my_selection = d3.selection()
    const render = bind(my_selection)
    render(args.data)
    return { my_init, my_component, my_render, my_selection, render, jq, format_value }
  }

  it('should require a render function', () => {
    (() => {Component({})}).should.throw('A render() function is required')
  })

  it('should not complain about render function if it\'s provided', () => {
    (() => {Component({'render': () => 0})}).should.not.throw('A render() function is required')
  })

  it('should return a function', () => {
    Component({'render': () => 0}).should.be.a.Function()
  })

  it('returned component should call args validator', () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      'render': () => 0,
      'validators': [my_validator],
    })

    my_component()
    my_validator.should.be.called()
  })

  it('returned component should call args validator with the correct arguments', () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      'render': () => 0,
      'validators': [my_validator],
    })

    my_component(42)
    my_validator.should.be.calledWith(42)
  })

  it('every validator should be called', () => {
    const my_validator = sinon.spy()
    const my_validator2 = sinon.spy()
    const my_component = Component({
      'render': () => 0,
      'validators': [my_validator, my_validator2],
    })

    my_component({'title': 42})
    my_validator.should.be.calledWith({'title': 42})
    my_validator2.should.be.calledWith({'title': 42})
  })

  it('validation fail should not be caught', () => {
    (() => {
      const my_component = Component({
        'render': () => 0, 'validators': [() => {throw new Error('Foo bar')}],
      })

      my_component({'title': 42})
    }).should.throw('Foo bar')
  })

  it('there should be a bind function', () => {
    const my_component = Component({
      'render': () => 0, 'validators': [],
    })

    const bind = my_component({'title': 42})
    bind.should.be.a.Function()
  })

  it('bind function should throw when called without arguments', () => {
    (() => {
      const my_component = Component({
        'render': () => 0, 'validators': []
      })
      const bind = my_component({'title': 42})
      bind()
    }).should.throw('A d3 selection is required')
  })

  it('bind function should not throw selection error if selection is supplied', () => {
    (() => {
      const my_component = Component({
        'render': () => 0, 'validators': []
      })
      const bind = my_component({'title': 42})
      const d3 = require('d3')
      bind(d3.selection())
    }).should.not.throw('A d3 selection is required')
  })

  it('bind function should throw selection error if bad selection is supplied', () => {
    (() => {
      const my_component = Component({
        'render': () => 0, 'validators': []
      })
      const bind = my_component({'title': 42})
      const bad_selection = 'not a selection'
      bind(bad_selection)
    }).should.throw('A d3 selection is required')
  })

  it('render() is called when the component is rendered', () => {
    const { my_render } = call_test_component_with({'instance_args': {}})
    my_render.should.be.called()
  })

  it('render() is called with correct arguments', () => {
    const { my_render, my_selection } = call_test_component_with({'instance_args': {'title': 42}, 'data': 'almafa'})
    my_render.should.be.calledWith({'title': 42}, my_selection, 'almafa')
  })

  it('render() is called with correct arguments 2', () => {
    const { my_render, my_selection } = call_test_component_with({'instance_args': {}, 'data': [1]})
    my_render.should.be.calledWith({}, my_selection, [1])
  })

  it('if there is an init() function, it should be called', () => {
    const { my_init } = call_test_component_with({'instance_args': {}, 'has_init': true})
    my_init.should.be.called()
  })

  it('if there is an init() function, it should be called with the correct arguments', () => {
    const { my_init, my_selection } = call_test_component_with({'instance_args': {'shit': 'happens'}, 'has_init': true})
    my_init.should.be.calledWith({'shit': 'happens'}, my_selection)
  })


  it('if there is an init() function, it should be called with the correct arguments 2', () => {
    const { my_init, my_selection } = call_test_component_with({'instance_args': {'bull': 'shit'}, 'has_init': true})
    my_init.should.be.calledWith({'bull': 'shit'}, my_selection)
  })

  it('if query is supplied, jq should be called', () => {
    const { jq } = call_test_component_with({'instance_args': {'query': ''}, 'render_func': () => null})
    jq.should.be.called()
  })

  it('jq should be called only if query is supplied', () => {
    const { jq } = call_test_component_with({'instance_args': {}, 'render_func': () => null})
    jq.should.not.be.called()
  })

  it('if query is supplied, jq should be called with data and query', () => {
    const { jq } = call_test_component_with({
      'instance_args': {'query': 'foo'}, 'data': 'bar', 'render_func': () => null})
    jq.should.be.calledWith('bar', 'foo')
  })

  it('if query is supplied, jq should be called with data and query 2', () => {
    const { jq } = call_test_component_with({
      'instance_args': {'query': '. | foo'}, 'data': 4, 'render_func': () => null})
    jq.should.be.calledWith(4, '. | foo')
  })

  it('render should be called with query return value', () => {
    const jq_return_value = 42
    const render_func = sinon.spy()
    call_test_component_with({
      'instance_args': {'query': '. | foo'}, 'data': 4, jq_return_value,
      'render_func': render_func})
    render_func.should.be.calledWith(sinon.match.any, sinon.match.any, jq_return_value)
  })

  it('render should be called with query return value 2', () => {
    const jq_return_value = 'foo'
    const render_func = sinon.spy()
    call_test_component_with({
      'instance_args': {'query': '. | asd'}, 'data': 4, jq_return_value,
      'render_func': render_func})
    render_func.should.be.calledWith(sinon.match.any, sinon.match.any, jq_return_value)
  })

  const loader_test = (args) => {
    const injector = require('inject-loader!./base_component.js')
    const jq = sinon.stub().resolves(args.jq_return_value)
    const my_loader = sinon.spy(function(url, callback) {
      if (args.no_resolve !== true)
        callback(null, args.fetched_value)
    })
    const d3 = require('d3')
    const Component = injector({
      '../jq-web.js': jq,
      'd3': {'json': my_loader, 'selection': d3.selection, 'csv': () => null}
    }).default
    const my_render = (args.render_func === undefined ) ? sinon.spy() : args.render_func
    const my_component = Component({
      'validators': [],
      'render': my_render,
    })
    if (args.instance_args === undefined) args.instance_args = {}
    args.instance_args.loader = args.loader
    const bind = my_component(args.instance_args)
    const my_selection = d3.selection()
    const render = bind(my_selection)
    render(args.data)
    return { my_loader, my_render, my_selection, 'instance_args': args.instance_args }
  }

  it('throws if invalid loader supplied', function() {
    (() => {
      loader_test({'loader': 'asdasdasd'})
    }).should.throw('Invalid loader')
  })

  it('doesnt throw if valid loader is supplied', function() {
    (() => {
      loader_test({'loader': 'csv'})
    }).should.not.throw('Invalid loader')
  })

  it('doesnt throw if valid loader is supplied 2', function() {
    (() => {
      loader_test({'loader': 'json'})
    }).should.not.throw('Invalid loader')
  })

  it('loader is called', function() {
    const { my_loader } = loader_test({'loader': 'json'})
    my_loader.should.be.called()
  })

  it('loader is called with render args', function() {
    const data = 'foo'
    const { my_loader } = loader_test({'loader': 'json', data})
    my_loader.should.be.calledWith(data)
  })

  it('loader is called with render args 2', function() {
    const data = ['bar']
    const { my_loader } = loader_test({'loader': 'json', data})
    my_loader.should.be.calledWith(data)
  })

  it('render is called with fetched data', function() {
    const fetched_value = {'hello': 'world'}
    const { my_render, instance_args, my_selection } = loader_test({'loader': 'json', fetched_value})
    my_render.should.be.calledWith(instance_args, my_selection, fetched_value)
  })

  it('should show a spinner while data is loading', () => {
    loader_test({'loader': 'json', 'no_resolve': true})
    assert.equal(d3.selection().selectAll('.spinner').size(), 1)
  })

  it('spinner should disappear after resolve', () => {
    loader_test({'loader': 'json'})
    assert.equal(d3.selection().selectAll('.spinner').size(), 0)
  })

  it('while jq is being loaded, a spinner should be displayed', () => {
    call_test_component_with({'instance_args': {'query': ''}, 'render_func': () => null, 'dont_execute_query': true})
    assert.equal(d3.selection().selectAll('.spinner').size(), 1)
  })

  it('spinner should disappear when query is finished', () => {
    call_test_component_with({'instance_args': {'query': ''}, 'render_func': () => null})
    assert.equal(d3.selection().selectAll('.spinner').size(), 0)
  })

  it('render is called with init return value', () => {
    const my_element = 11
    const { my_render } = call_test_component_with({'element': my_element, 'has_init': true})
    my_render.should.be.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, my_element)
  })

  it('calls format_value with proper arguments', () => {
    const state_handler = {
      'subscribe': sinon.spy(),
      'get_state': sinon.stub().returns({'x': '2'})}
    const { format_value } = call_test_component_with({
      'instance_args': {
        '${x}2': ['${y}'],
        'state_handler': state_handler
      }
    })
    format_value.should.be.calledWith({
      '${x}2': ['${y}'],
      'state_handler': state_handler
    }, {'x': '2'})
  })

  it('init should receive correct args', () => {
    const state_handler = {
      'subscribe': sinon.spy(),
      'get_state': sinon.stub().returns({'x': '2', 'y': 'foo'})}
    const { my_init } = call_test_component_with({
      'instance_args': {
        '${x}2': ['${y}'],
        'state_handler': state_handler
      },
      'has_init': true,
      'format_value_return': {
        '22': ['foo'],
        'state_handler': state_handler
      }
    })
    my_init.should.be.called()
    my_init.should.be.calledWith({
      '22': ['foo'],
      'state_handler': sinon.match.any
    },
    )
  })

  it('render should receive correct args', () => {
    const state_handler = {
      'subscribe': sinon.spy(),
      'get_state': sinon.stub().returns({'x': '2', 'y': 'foo'})}
    const { my_render } = call_test_component_with({
      'instance_args': {
        '${x}2': ['${y}'],
        'state_handler': state_handler
      },
      'has_init': true,
      'format_value_return': {
        '22': ['foo'],
        'state_handler': state_handler
      },
      'format_value_return2': {
        '22': ['foo'],
        'state_handler': state_handler
      }
    })
    my_render.should.be.called()
    my_render.should.be.calledWith({
      '22': ['foo'],
      'state_handler': sinon.match.any
    },
    )
  })

  it('subscribes to state changes', () => {
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy()}
    const { my_render } = call_test_component_with({
      'instance_args': {
        'state_handler': state_handler
      },
      'has_init': true,
    })
    state_handler.subscribe.should.be.called()
  })

  it('re-subscribes to state changes', () => {
    let callback
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy(function(f) {callback = f})}
    const { my_render } = call_test_component_with({
      'instance_args': {
        'state_handler': state_handler
      },
      'element': {'remove': () => null},
      'has_init': true,
    })
    callback(state_handler, callback)
    state_handler.subscribe.should.be.calledTwice()
  })

  it('calls init with new arguments when variables change', () => {
    let callback
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy(function(f) {callback = f})}
    const { my_init } = call_test_component_with({
      'instance_args': {
        '${x}': '${y}',
        'state_handler': state_handler
      },
      'has_init': true,
      'element': {'remove': () => null},
      'format_value_return2': {
        'foo': 'bar',
        'state_handler': sinon.match.any
      }
    })
    state_handler.get_state = () => ({'x': 'foo', 'y': 'bar'})
    callback(state_handler, callback)
    my_init.should.be.calledWith(
      {
        'foo': 'bar',
        'state_handler': sinon.match.any
      },
      sinon.match.any
    )
  })

  it('when re-init happens, old element is deleted', () => {
    let callback
    const element = {'remove': sinon.spy()}
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy(function(f) {callback = f})}
    const { my_init } = call_test_component_with({
      'instance_args': {
        '${x}': '${y}',
        'state_handler': state_handler
      },
      'has_init': true,
      'element': element,
      'format_value_return2': {
        'foo': 'bar',
        'state_handler': sinon.match.any
      }
    })
    state_handler.get_state = () => ({'x': 'foo', 'y': 'bar'})
    callback(state_handler, callback)
    element.remove.should.be.called()
  })

  it('when re-init happens, re-render happens', () => {
    let callback
    const element = {'remove': sinon.spy()}
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy(function(f) {callback = f})}
    const { my_render } = call_test_component_with({
      'instance_args': {
        '${x}': '${y}',
        'state_handler': state_handler
      },
      'has_init': true,
      'element': element,
      'format_value_return2': {
        'foo': 'bar',
        'state_handler': sinon.match.any
      }
    })
    state_handler.get_state = () => ({'x': 'foo', 'y': 'bar'})
    callback(state_handler, callback)
    my_render.should.be.calledTwice()
  })

  it('correct element is passed to render when re-init happens', () => {
    let callback
    const element = {'remove': sinon.spy()}
    const element2 = {'remove': sinon.spy()}
    const state_handler = {
      'get_state': sinon.spy(),
      'subscribe': sinon.spy(function(f) {callback = f})}
    const { my_render } = call_test_component_with({
      'instance_args': {
        '${x}': '${y}',
        'state_handler': state_handler
      },
      'has_init': true,
      'element': element,
      'element2': element2,
      'format_value_return2': {
        'foo': 'bar',
        'state_handler': sinon.match.any
      }
    })
    state_handler.get_state = () => ({'x': 'foo', 'y': 'bar'})
    callback(state_handler, callback)
    my_render.should.be.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, element2)
  })


})
