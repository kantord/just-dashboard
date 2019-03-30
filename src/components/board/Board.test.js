import should from 'should' // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import assert from 'assert'

describe('Board component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')(undefined, {'url': 'https://fake.url.com'})
  })

  afterEach(function () {
    this.jsdom()
  })

  it('integration test', () => {
    const test_parser = require('../../test_parser.js').default
    const bind = test_parser({
      'component': 'root', 'args': { 'title': '', 'state_handler': {} },
      'data': [
        {'component': 'board',
          'args': {'state_handler': {}},
          'data': [
            {'component': 'text', 'args': {'tagName': 'h4'}, 'data': 'random'}
          ]
        }
      ]
    })
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--board').size(), 1)
  })

})
