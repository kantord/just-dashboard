import assert from 'node:assert'
import * as d3 from 'd3'
import sinon from 'sinon'
import DropdownComponent from './Dropdown'

describe('Text component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
  })

  it('should throw on invalid variable name', () => {
    expect(() => {
      ;(DropdownComponent({ variable: 'foo bar', default: null } as any) as any)()(undefined as any)
    }).toThrow("Argument 'variable' is invalid")
  })

  it('requires default value', () => {
    expect(() => {
      ;(DropdownComponent({ variable: 'foobar' } as any) as any)()(undefined as any)
    }).toThrow("Argument 'default' is required but not supplied.")
  })

  const call_render_with = (args: any) => {
    const init_variable = sinon.spy()
    const set_variable = sinon.spy()
    const get_state = sinon.stub().returns(args.state || {})
    const subscribe = args.subscribe === undefined ? sinon.spy() : args.subscribe
    const state_handler = { init_variable, set_variable, get_state, subscribe }
    const component_args = Object.assign(args.args, {
      state_handler,
    })
    const render = DropdownComponent(component_args)(d3.selection())
    render(args.data)
    return { render, init_variable, set_variable, d3 }
  }

  it('creates select item', () => {
    call_render_with({ args: { variable: 'my_var', default: '' }, data: [] })
    assert.equal(d3.selectAll('select.ds--select').size(), 1)
  })

  const option_inputs = [
    [{ value: 4, text: 'four' }],
    [
      { value: 4, text: 'four' },
      { value: 5, text: 'five' },
    ],
  ]

  option_inputs.forEach((input) => {
    it(`creates option(s) - ${input.length}`, () => {
      call_render_with({ args: { variable: 'my_var', default: '' }, data: input })
      assert.equal(d3.selectAll('option.ds--select-option').size(), input.length)
    })
  })

  it('removes superfluous options', () => {
    const { render } = call_render_with({
      args: { variable: 'my_var', default: '' },
      data: [
        { value: 4, text: 'four' },
        { value: 5, text: 'five' },
      ],
    })
    render([{ value: 4, text: 'four' }])
    assert.equal(d3.selectAll('option.ds--select-option').size(), 1)
  })

  const values_to_try = [4, 5]
  values_to_try.forEach((value) =>
    it('sets value property', () => {
      call_render_with({ args: { variable: 'my_var', default: '' }, data: [{ value: value, text: 'four' }] })
      assert.equal((d3.select('option.ds--select-option').node() as any).value, value)
    }),
  )

  const texts_to_try = ['foo', 'bar']
  texts_to_try.forEach((text) =>
    it('sets text property', () => {
      call_render_with({ args: { variable: 'my_var', default: '' }, data: [{ text: text, value: null }] })
      assert.equal(d3.select('option.ds--select-option').text(), text)
    }),
  )

  it('updated existing option text', () => {
    const { render } = call_render_with({
      args: { variable: 'my_var', default: '' },
      data: [{ text: 'foo', value: null }],
    })
    render([{ text: 'bar', value: null }])
    assert.equal(d3.select('option.ds--select-option').text(), 'bar')
  })

  it('updated existing option value', () => {
    const { render } = call_render_with({
      args: { variable: 'my_var', default: '' },
      data: [{ text: 'foo', value: 0 }],
    })
    render([{ text: 'foo', value: -56 }])
    assert.equal((d3.select('option.ds--select-option').node() as any).value, -56)
  })

  it('init_variable has to be called with default value', () => {
    const my_spy = sinon.spy()
    const { init_variable } = call_render_with({
      args: { variable: 'my_var', default: my_spy },
      data: [{ text: 'foo', value: 0 }],
    })
    expect(init_variable.calledWith('my_var', my_spy)).toBe(true)
  })

  it('init_variable has to be called with default value 2', () => {
    const my_spy = sinon.spy()
    const { init_variable } = call_render_with({
      args: { variable: 'my_var2', default: my_spy },
      data: [{ text: 'foo', value: 0 }],
    })
    expect(init_variable.calledWith('my_var2', my_spy)).toBe(true)
  })

  it('set_variable should not be called before change', () => {
    const { set_variable } = call_render_with({
      args: { variable: 'my_var', default: '' },
      data: [{ text: 'foo', value: 0 }],
    })
    expect(set_variable.called).toBe(false)
  })

  it('set_variable should be called after change', () => {
    const { d3, set_variable } = call_render_with({
      args: { variable: 'var', default: '' },
      data: [
        { text: 'foo', value: 'fo' },
        { text: 'bar', value: 'bar' },
      ],
    })
    d3.select('select').property('value', 'fo')
    d3.select('select').dispatch('change')
    expect(set_variable.calledWith('var', 'fo')).toBe(true)
  })

  it('set_variable should be called after change 2', () => {
    const { d3, set_variable } = call_render_with({
      args: { variable: 'my_var', default: '' },
      data: [
        { text: 'foo', value: 'fo' },
        { text: 'bar', value: 'baz' },
      ],
    })
    d3.select('select').property('value', 'fo')
    d3.select('select').property('value', 'baz')
    d3.select('select').dispatch('change')
    expect(set_variable.calledWith('my_var', 'baz')).toBe(true)
  })

  it('correct value should be selected based on state', () => {
    call_render_with({
      args: { variable: 'my_var', default: '0' },
      state: { my_var: 1 },
      data: [
        { text: 'foo', value: '0' },
        { text: 'bar', value: '1' },
      ],
    })
    assert.equal((d3.select('select').node() as any).value, '1')
  })

  it('correct number of items after state change', () => {
    let callback: any
    const { d3 } = call_render_with({
      subscribe: (f: any) => {
        callback = f
      },
      args: { variable: 'my_var', default: '' },
      data: [
        { text: 'foo', value: 'fo' },
        { text: 'bar', value: 'baz' },
      ],
    })
    assert.equal(d3.selectAll('option.ds--select-option').size(), 2, 'Correct number of items before change')
    d3.select('select').property('value', 'baz')
    d3.select('select').dispatch('change')
    callback({ subscribe: sinon.spy() }, callback)
    assert.equal(d3.selectAll('option.ds--select-option').size(), 2, 'Correct number of items after change')
  })

  const magic_default_values = [
    { default_value: '~first', actual_value: 'fo' },
    { default_value: '~last', actual_value: 'bar' },
  ]
  magic_default_values.forEach(({ default_value, actual_value }) =>
    it(`automatic default variable ${default_value}`, () => {
      const { set_variable } = call_render_with({
        args: { variable: 'var', default: default_value },
        state: { var: default_value },
        data: [
          { text: 'foo', value: 'fo' },
          { text: 'bar', value: 'bar' },
        ],
      })
      expect(set_variable.calledWith('var', actual_value)).toBe(true)
    }),
  )
})
