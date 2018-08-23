import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'

describe('Tabs component', function() {
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
        {'component': 'tabs',
          'args': {'state_handler': {}},
          'data': [
            {'Hello World': 
              {'component': 'text', 
               'args': {'tagName': 'h4'}, 'data': 'random'}},
            {'Foo Bar': 
              {'component': 'text',
               'args': {'tagName': 'h3'}, 'data': 'nonr@ndom'}},
          ]
        }
      ]
    })
    bind(d3.selection())()
    assert.equal(d3.selection().select('.ds--tabs .ds--tab h4').text(),
      'random')
  })
})
