import assert from 'node:assert'
import * as d3 from 'd3'
import test_parser from '../../test_parser'

describe('Columns component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  it('integration test', () => {
    const bind = test_parser({
      component: 'root',
      args: { title: '', state_handler: {} },
      data: [
        {
          component: 'columns',
          args: { state_handler: {} },
          data: [{ component: 'text', args: { tagName: 'h4' }, data: 'random' }],
        },
      ],
    } as any)
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--columns[data-ds--columns="2"] .ds--column h4').text(), 'random')
  })

  it('integration test - non default column count', () => {
    const bind = test_parser({
      component: 'root',
      args: { title: '', state_handler: {} },
      data: [
        {
          component: 'columns',
          args: { columns: 3 },
          data: [{ component: 'text', args: { tagName: 'h4' }, data: 'foobar' }],
        },
      ],
    } as any)
    bind(d3.selection())
    assert.equal(d3.selection().select('.ds--columns[data-ds--columns="3"] .ds--column h4').text(), 'foobar')
  })
})
