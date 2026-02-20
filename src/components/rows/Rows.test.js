import * as d3 from 'd3'
import assert from 'assert'
import test_parser from '../../test_parser.js'

describe('Rows component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  it('integration test', () => {
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
    assert.equal(d3.selection().select('.ds--rows .ds--row h4').text(),
      'random')
  })
})
