import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'

describe('Rows component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  it('integration test', () => {
    const test_parser = require('../../test_parser.js').default
    const bind = test_parser({
      'component': 'root', 'args': { 'title': '', 'state_handler': {} },
      'data': [
        {'component': 'rows',
          'args': {'state_handler': {}},
          'data': [
            {'component': 'text', 'args': {'tagName': 'h4'}, 'data': 'random'}
          ]
        }
      ]
    })
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--rows .ds--row h4').text(), 'random')
  })
})
