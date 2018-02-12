import should from 'should' // eslint-disable-line no-unused-vars
import DropdownComponent from './Dropdown'
import assert from 'assert'
import sinon from 'sinon'

describe('Text component', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  it('should throw on invalid variable name', () => {
    (() => {DropdownComponent({'variable': 'foo bar', 'default': null})()()})
      .should.throw('Argument \'variable\' is invalid')
  })

  it('requires default value', () => {
    (() => {DropdownComponent({'variable': 'foobar'})()()})
      .should.throw('Argument \'default\' is required but not supplied.')
  })

  const call_render_with = (args) => {
    const d3 = require('d3')
    const init_variable = sinon.spy()
    const set_variable = sinon.spy()
    const component_args = Object.assign(args.args, {
      'init_variable': init_variable,
      'set_variable': set_variable,
    })
    const render = DropdownComponent(component_args)(d3.selection())
    render(args.data)
    return { render, init_variable, set_variable, d3 }
  }

  it('creates select item', () => {
    const d3 = require('d3')
    call_render_with({'args': {'variable': 'my_var', 'default': ''}, 'data': []})
    assert.equal(d3.selectAll('select.ds--select').size(), 1)
  })
  
  const option_inputs = [
    [{ 'value': 4, 'text': 'four' }],
    [{ 'value': 4, 'text': 'four' }, { 'value': 5, 'text': 'five' }],
  ]

  option_inputs.forEach(input => {
    it(`creates option(s) - ${input.length}`, () => {
      const d3 = require('d3')
      call_render_with({'args': {'variable': 'my_var', 'default': ''}, 'data': input})
      assert.equal(d3.selectAll('option.ds--select-option').size(), input.length)
    })
  })

  it('removes superfluous options', () => {
    const d3 = require('d3')
    const { render } = call_render_with({'args': {'variable': 'my_var', 'default': ''},
      'data': [{ 'value': 4, 'text': 'four' }, { 'value': 5, 'text': 'five' }]})
    render([{ 'value': 4, 'text': 'four' }])
    assert.equal(d3.selectAll('option.ds--select-option').size(), 1)
  })

  const values_to_try = [4, 5]
  values_to_try.forEach(value => 
    it('sets value property', () => {
      const d3 = require('d3')
      call_render_with({'args': {'variable': 'my_var', 'default': ''},
        'data': [{ 'value': value, 'text': 'four' }]})
      assert.equal(d3.select('option.ds--select-option').node().value, value)
    }))

  const texts_to_try = ['foo', 'bar']
  texts_to_try.forEach(text => 
    it('sets text property', () => {
      const d3 = require('d3')
      call_render_with({'args': {'variable': 'my_var', 'default': ''},
        'data': [{ 'text': text, 'value': null }]})
      assert.equal(d3.select('option.ds--select-option').text(), text)
    }))

  it('updated existing option text', () => {
    const d3 = require('d3')
    const { render } = call_render_with({'args': {'variable': 'my_var', 'default': ''},
      'data': [{ 'text': 'foo', 'value': null }]})
    render([{ 'text': 'bar', 'value': null }])
    assert.equal(d3.select('option.ds--select-option').text(), 'bar')
  })

  it('updated existing option value', () => {
    const d3 = require('d3')
    const { render } = call_render_with({'args': {'variable': 'my_var', 'default': ''},
      'data': [{ 'text': 'foo', 'value': 0 }]})
    render([{ 'text': 'foo', 'value': -56 }])
    assert.equal(d3.select('option.ds--select-option').node().value, -56)
  })

  it('init_variable has to be called with default value', () => {
    const my_spy = sinon.spy()
    const { init_variable } = call_render_with({'args': {'variable': 'my_var', 'default': my_spy},
      'data': [{ 'text': 'foo', 'value': 0 }]})
    init_variable.should.be.calledWith('my_var', my_spy)
  })

  it('init_variable has to be called with default value 2', () => {
    const my_spy = sinon.spy()
    const { init_variable } = call_render_with({'args': {'variable': 'my_var2', 'default': my_spy},
      'data': [{ 'text': 'foo', 'value': 0 }]})
    init_variable.should.be.calledWith('my_var2', my_spy)
  })

  it('set_variable should not be called before change', () => {
    const { set_variable } = call_render_with({'args': {'variable': 'my_var', 'default': ''},
      'data': [{ 'text': 'foo', 'value': 0 }]})
    set_variable.should.not.be.called()
  })

  it('set_variable should be called after change', () => {
    const { d3, set_variable } = call_render_with({'args': {'variable': 'var', 'default': ''},
      'data': [
        { 'text': 'foo', 'value': 'fo' },
        { 'text': 'bar', 'value': 'bar' },
      ]})
    d3.select('select').property('value', 'fo')
    d3.select('select').dispatch('change')
    set_variable.should.be.calledWith('var', 'fo')
  })

  it('set_variable should be called after change 2', () => {
    const { d3, set_variable } = call_render_with({'args': {'variable': 'my_var', 'default': ''},
      'data': [
        { 'text': 'foo', 'value': 'fo' },
        { 'text': 'bar', 'value': 'baz' },
      ]})
    d3.select('select').property('value', 'fo')
    d3.select('select').property('value', 'baz')
    d3.select('select').dispatch('change')
    set_variable.should.be.calledWith('my_var', 'baz')
  })

})

