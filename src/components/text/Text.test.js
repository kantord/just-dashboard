import should from 'should' // eslint-disable-line no-unused-vars
import TextComponent from './Text'
import assert from 'assert'

describe('Text component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')(undefined, {'url': 'https://fake.url.com'})
  })

  afterEach(function () {
    this.jsdom()
  })

  const get_render_function = (component_args) => {
    const bind = TextComponent(component_args)
    const d3 = require('d3')
    const render = bind(d3.selection())
    return { render, d3 }
  }

  it('should throw on invalid tag name', () => {
    (() => {TextComponent({'tagName': 'foo bar'})()()})
      .should.throw('Argument \'tagName\' is invalid')
  })

  it('text is rendered', function() {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Hello World from TextComponent')
    assert.equal(d3.selection().select('span').text(),
      'Hello World from TextComponent')
  })

  it('update function updates text', function() {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Hello World from TextComponent')
    render('Second version')
    assert.equal(d3.selection().select('span').text(), 'Second version')
  })

  it('text align center', function() {
    const { render, d3 } = get_render_function(
      {'tagName': 'span', 'align': 'center'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align="center"]').text(),
      'Second version')
  })

  it('align only if attr is supplied', function() {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align]').size(), 0)
  })

  it('text align right', function() {
    const { render, d3 } = get_render_function(
      {'tagName': 'span', 'align': 'right'})
    render('Second version')
    assert.equal(d3.selection().select('[data-align="right"]').text(),
      'Second version')
  })

  it('proper class attached', function() {
    const { render, d3 } = get_render_function({'tagName': 'span'})
    render('Second version')
    assert.equal(d3.selection().select('.ds--text').size(), 1)
  })

  it('proper item is updated', () => {
    const d3 = require('d3')
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

