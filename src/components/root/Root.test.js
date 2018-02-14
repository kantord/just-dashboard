import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'
import sinon from 'sinon'

describe('Root component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  beforeEach(function () {
    document.head.innerHTML = '<title>foobar</title>'
  })

  const RootComponentInjector = (args) => {
    const injector = require('inject-loader!./Root')
    return injector(args)
  }

  const get_component_with_parser = (parser) => {
    return RootComponentInjector({
      '../../default_parser.js': parser
    }).default
  }

  const call_render_with = (args) => {
    const RootComponent = get_component_with_parser(args.parser)
    const bind = RootComponent(args.component_args)
    const d3 = require('d3')
    const render = bind(d3.selection())
    render(args.render_args)
  }

  it('title text is set', function() {
    call_render_with({
      'component_args': {'title': 'My example title'}
    })
    assert.equal(d3.selection().select('title').text(), 'My example title')
  })

  it('render child element', function() {
    call_render_with({
      'component_args': {'title': 'I don\'t care'},
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [{'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title'}]
    })
    assert.equal(d3.selection().select('h1').text(), 'My title')
  })

  it('render child element only if there is a child', function() {
    call_render_with({
      'component_args': {'title': 'I don\'t care'},
      'render_args': []
    })
    assert.equal(d3.selection().selectAll('h1').size(), 0)
  })

  it('render each child', function() {
    call_render_with({
      'component_args': {'title': 'I don\'t care'},
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('h1').size(), 2)
  })

  it('renders parsed component', function() {
    call_render_with({
      'component_args': {'title': ''},
      'parser': () => (selection) => selection.append('b').text(''),
      'render_args': [ { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' } ]
    })
    assert.equal(d3.selection().selectAll('b').size(), 1)
  })

  it('integration test', () => {
    const test_parser = require('../../test_parser.js').default
    const bind = test_parser({
      'component': 'root',
      'args': {
        'title': 'Another example title'
      },
      'data': [
        {
          'component': 'text',
          'args': {'tagName': 'p'},
          'data': 'Almafa'
        }
      ]
    })
    bind(d3.selection())
    assert.equal(d3.selection().select('body p').text(), 'Almafa')
  })

  it('children are wrapped in child wrapper', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'component_args': {'title': ''},
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('.ds--wrapper').size(), 2)
  })

  it('variables are initialized in state', function() {
    const state_handler = {'init_variable': sinon.spy()}
    const my_default = sinon.spy()
    call_render_with({
      'parser': (component) => () => component.args.state_handler.init_variable(
        component.args.variable, component.args.default),
      'component_args': {'title': 'x', 'state_handler': state_handler},
      'render_args': [
        { 'component': 'dropdown', 'args': {
          'default': my_default, 'variable': 'foo',
        }, 'data': [] }
      ]
    })
    state_handler.init_variable.should.be.calledWith('foo', my_default)
  })

  it('variables are updated in state', function() {
    const state_handler = {'set_variable': sinon.spy()}
    const my_default = sinon.spy()
    call_render_with({
      'parser': (component) => () => component.args.state_handler.set_variable(
        component.args.variable, component.args.default),
      'component_args': {'title': 'x', 'state_handler': state_handler},
      'render_args': [
        { 'component': 'dropdown', 'args': {
          'default': my_default, 'variable': 'foo',
        }, 'data': [] }
      ]
    })
    state_handler.set_variable.should.be.calledWith('foo', my_default)
  })

})
