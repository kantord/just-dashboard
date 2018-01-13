import should from 'should' // eslint-disable-line no-unused-vars
import TextComponent from './Text'
import assert from 'assert'
var jsdom = require('mocha-jsdom')

describe('Text component', function() {
  jsdom({'useEach': true})

  it('passing empty data should throw', () => {
    (() => {TextComponent({})()()}).should.throw('Tag name required')
  })

  it('passing tagName should not throw tagName error', () => {
    (() => {TextComponent({'tagName': 'foo bar'})()()})
      .should.not.throw('Tag name required')
  })

  it('should throw on invalid tag name', () => {
    (() => {TextComponent({'tagName': 'foo bar'})()()})
      .should.throw('Invalid tag name')
  })

  it('passing args should return a function', () => {
    TextComponent({'tagName': 'div'}).should.be.a.Function()
  })

  it('bind function should throw when called without arguments', () => {
    (() => {
      const bind = TextComponent({'tagName': 'h1'})
      const render = bind()
      render()
    }).should.throw('A d3 selection is required')
  })

  it('bind function should not throw selection error if selection is supplied', function() {
    (() => {
      const bind = TextComponent({'tagName': 'h1'})
      const d3 = require('d3')
      const render = bind(d3.selection())
      render()
    }).should.not.throw()
  })

  it('bind function should throw selection error if bad selection is supplied', () => {
    (() => {
      const bind = TextComponent({'tagName': 'h1'})
      const render = bind(42)
      render()
    }).should.throw('A d3 selection is required')
  })

  it('bind function should create render function', function() {
    const bind = TextComponent({'tagName': 'example'})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render.should.be.Function()
  })

  it('text is rendered', function() {
    document.head.innerHTML = '<title>foobar</title>'
    const bind = TextComponent({'tagName': 'span'})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render('Hello World from TextComponent')
    assert.equal(d3.selection().select('span').text(), 'Hello World from TextComponent')
  })

  it('update function updates text', function() {
    document.head.innerHTML = '<title>foobar</title>'
    const bind = TextComponent({'tagName': 'span'})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render('Hello World from TextComponent')
    render('Second version')
    assert.equal(d3.selection().select('span').text(), 'Second version')
  })

})

