import should from 'should' // eslint-disable-line no-unused-vars
import TextComponent from './Text'
import assert from 'assert'
var jsdom = require('mocha-jsdom')

describe('Text component', function() {
  jsdom({'useEach': true})

  it('should throw on invalid tag name', () => {
    (() => {TextComponent({'tagName': 'foo bar'})()()})
      .should.throw('Invalid tag name')
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

