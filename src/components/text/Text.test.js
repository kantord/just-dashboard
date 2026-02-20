import TextComponent from './Text'
import assert from 'assert'
import * as d3 from 'd3'

describe('Text component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  const get_render_function = (component_args) => {
    const bind = TextComponent(component_args)
    const render = bind(d3.selection())
    return { render, d3 }
  }

  it('should throw on invalid tag name', () => {
    expect(() => { TextComponent({'tagName': 'foo bar'})()() })
      .toThrow('Argument \'tagName\' is invalid')
  })

  it('text is rendered', () => {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Hello World from TextComponent')
    assert.equal(d3.selection().select('span').text(),
      'Hello World from TextComponent')
  })

  it('update function updates text', () => {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Hello World from TextComponent')
    render('Second version')
    assert.equal(d3.selection().select('span').text(), 'Second version')
  })

  it('text align center', () => {
    const { render, d3 } = get_render_function(
      {'tagName': 'span', 'align': 'center'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align="center"]').text(),
      'Second version')
  })

  it('align only if attr is supplied', () => {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align]').size(), 0)
  })

  it('text align right', () => {
    const { render, d3 } = get_render_function(
      {'tagName': 'span', 'align': 'right'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align="right"]').text(),
      'Second version')
  })

  it('proper class attached', () => {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Second version')
    assert.equal(d3.selection().select('.ds--text').size(), 1)
  })

  it('proper item is updated', () => {
    const render1 = TextComponent({'tagName': 'h4'})(d3.selection())
    const render2 = TextComponent({'tagName': 'h4'})(d3.selection())
    render1('a')
    render2('b')
    assert.equal(
      d3.select(d3.selection().selectAll('.ds--text').nodes()[0]).text(), 'a')
    assert.equal(
      d3.select(d3.selection().selectAll('.ds--text').nodes()[1]).text(), 'b')
  })
})
