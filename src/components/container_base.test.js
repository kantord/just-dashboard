import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'
import Component from '../components/base_component.js'
import sinon from 'sinon'

describe('base container component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  beforeEach(function () {
    document.head.innerHTML = '<title>foobar</title>'
  })

  const base_container_componentInjector = (args) => {
    const injector = require('inject-loader!./container_base.js')
    return injector(args)
  }

  const get_component_with_mocks = ({ parser, Component }) => {
    return base_container_componentInjector({
      '../default_parser.js': parser,
      './base_component.js': Component
    }).default
  }

  const call_render_with = (args) => {
    const my_component_func = sinon.spy(Component)
    const base_container_component = get_component_with_mocks({
      'parser': args.parser,
      'Component': my_component_func
    })
    const my_component = base_container_component({
      'wrapper_tag': args.wrapper_tag, 'wrapper_class': args.wrapper_class,
      'validators': args.validators, 'init': args.init
    })
    const bind = my_component(args.component_args)
    const d3 = require('d3')
    const render = bind(d3.selection())
    render(args.render_args)

    return { my_component_func, render }
  }

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
    const test_parser = require('../test_parser.js').default
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
      'wrapper_tag': 'div', 'wrapper_class': 'foo',
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('div.foo').size(), 2)
  })

  it('children are wrapped in child wrapper', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'component_args': {'title': ''},
      'wrapper_tag': 'span', 'wrapper_class': 'bar',
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('span.bar').size(), 2)
  })

  it('calls components with actual validators', () => {
    const my_validators = [sinon.spy()]
    const { my_component_func } = call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'component_args': {'title': ''},
      'wrapper_tag': 'span', 'wrapper_class': 'bar',
      'validators': my_validators,
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    my_component_func.should.be.calledWith({
      'render': sinon.match.any,
      'init': sinon.match.any,
      'validators': my_validators
    })
  })

  it('calls component with actual init function', () => {
    const my_init = sinon.spy()
    const { my_component_func } = call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'component_args': {'title': ''},
      'wrapper_tag': 'span', 'wrapper_class': 'bar',
      'init': my_init,
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    my_component_func.should.be.calledWith({
      'render': sinon.match.any,
      'init': my_init,
      'validators': sinon.match.any
    })
  })

  it('only new component is visible after second render', () => {
    const { render } = call_render_with({
      'parser': (component) => (selection) => selection.append(component.component),
      'component_args': {'title': ''},
      'wrapper_tag': 'span', 'wrapper_class': 'bar',
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('text').size(), 2)
    render([
      {'component': 'text2', 'args': {}, 'data': null}
    ])
    assert.equal(d3.selection().selectAll('text2').size(), 1)
    assert.equal(d3.selection().selectAll('text').size(), 0)
  })



})
