import * as d3 from 'd3'
import assert from 'assert'
import test_parser from '../../test_parser'

describe('Board component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  it('integration test', () => {
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
    } as any)
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--board').size(), 1)
  })
})
