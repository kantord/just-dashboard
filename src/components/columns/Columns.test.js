import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'
var jsdom = require('mocha-jsdom')

describe('Columns component', function() {
  jsdom({'useEach': true})

  it('integration test', () => {
    const test_parser = require('../../test_parser.js').default
    const bind = test_parser({
      'component': 'root', 'args': { 'title': '' },
      'data': [
        {'component': 'columns',
          'data': [
            {'component': 'text', 'args': {'tagName': 'h4'}, 'data': 'random'}
          ]
        }
      ]
    })
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--columns[data-ds--columns="2"] .ds--column h4').text(), 'random')
  })

  it('integration test - non default column count', () => {
    const test_parser = require('../../test_parser.js').default
    const bind = test_parser({
      'component': 'root', 'args': { 'title': '' },
      'data': [
        {'component': 'columns',
          'args': {'columns': 3},
          'data': [
            {'component': 'text', 'args': {'tagName': 'h4'}, 'data': 'foobar'}
          ]
        }
      ]
    })
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--columns[data-ds--columns="3"] .ds--column h4').text(), 'foobar')
  })

})
