import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'
var jsdom = require('mocha-jsdom')

describe('Rows component', function() {
  jsdom({'useEach': true})

  const RowsComponentInjector = (args) => {
    const injector = require('inject-loader!./Rows')
    return injector(args)
  }

  const get_component_with_parser = (parser) => {
    return RowsComponentInjector({
      '../../default_parser.js': parser
    }).default
  }

  const call_render_with = (args) => {
    const RowsComponent = get_component_with_parser(args.parser)
    const bind = RowsComponent(args.component_args)
    const d3 = require('d3')
    const render = bind(d3.selection())
    render(args.render_args)
  }

  it('render child element', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [{'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title'}]
    })
    assert.equal(d3.selection().select('h1').text(), 'My title')
  })

  it('render child element only if there is a child', function() {
    call_render_with({
      'render_args': []
    })
    assert.equal(d3.selection().selectAll('h1').size(), 0)
  })

  it('render each child', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('h1').size(), 2)
  })

  it('children are wrapped in group wrapper', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('.ds--rows h1').size(), 2)
  })

  it('children are wrapped in child wrapper', function() {
    call_render_with({
      'parser': () => (selection) => selection.append('h1').text('My title'),
      'render_args': [
        { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' },
        { 'component': 'text', 'args': {'tagName': 'h2'}, 'data': 'My secondary header' }
      ]
    })
    assert.equal(d3.selection().selectAll('.ds--rows>.ds--row>h1').size(), 2)
  })

  it('renders parsed component', function() {
    call_render_with({
      'component_args': {},
      'parser': () => (selection) => selection.append('b').text(''),
      'render_args': [ { 'component': 'text', 'args': {'tagName': 'h1'}, 'data': 'My title' } ]
    })
    assert.equal(d3.selection().selectAll('b').size(), 1)
  })


})
