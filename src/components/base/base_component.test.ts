import assert from 'node:assert'
import sinon from 'sinon'
import { vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  format_value: vi.fn() as any,
  jq: vi.fn() as any,
  d3Overrides: {} as Record<string, any>,
}))

vi.mock('../../interpolation', () => ({
  format_value: (...args: any[]) => mocks.format_value(...args),
}))

vi.mock('../../jq-web', () => ({
  default: (...args: any[]) => mocks.jq(...args),
}))

vi.mock('d3', async (importOriginal) => {
  const real: any = await importOriginal()
  return {
    ...real,
    get json() {
      return mocks.d3Overrides.json || real.json
    },
    get csv() {
      return mocks.d3Overrides.csv || real.csv
    },
    get text() {
      return mocks.d3Overrides.text || real.text
    },
    get tsv() {
      return mocks.d3Overrides.tsv || real.tsv
    },
    get csvParse() {
      return mocks.d3Overrides.csvParse || real.csvParse
    },
    get tsvParse() {
      return mocks.d3Overrides.tsvParse || real.tsvParse
    },
  }
})

import * as d3 from 'd3'
import Component from './index'
import { execute_query } from './render'

describe('Component', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<head><title></title></head><body></body>'
    mocks.format_value = vi.fn()
    mocks.jq = vi.fn()
    mocks.d3Overrides = {}
  })

  const call_test_component_with = (args: any) => {
    const jq = sinon.stub().returns(
      args.dont_execute_query === true
        ? {
            then: () => ({ catch: () => null }),
          }
        : {
            then: (resolve: any, reject: any) => {
              if (args.jq_error) reject(args.jq_error)
              resolve(args.jq_return_value)
              return { catch: () => null }
            },
          },
    )
    const format_value = sinon.stub().onCall(0).returns(args.format_value_return).returns(args.format_value_return2)

    mocks.jq = jq
    mocks.format_value = format_value

    const my_init = sinon.stub().onCall(1).returns(args.element2).returns(args.element)
    const my_render = args.render_func === undefined ? sinon.spy() : args.render_func
    const my_validator = sinon.spy()
    const validators = [my_validator]
    const my_component =
      args.has_init === true
        ? Component({
            render: my_render,
            validators: validators,
            init: args.init_func ? args.init_func : my_init,
          } as any)
        : Component({
            render: my_render,
            validators: validators,
          } as any)
    const bind = my_component(args.instance_args)
    const my_selection = d3.selection()
    const render = bind(my_selection as any)
    render(args.data)
    return { my_init, my_component, my_render, my_selection, render, jq, format_value, my_validator, d3 }
  }

  it('should require a render function', () => {
    expect(() => {
      Component({} as any)
    }).toThrow('A render() function is required')
  })

  it("should not complain about render function if it's provided", () => {
    expect(() => {
      Component({ render: () => 0 } as any)
    }).not.toThrow('A render() function is required')
  })

  it('should return a function', () => {
    expect(typeof Component({ render: () => 0 } as any)).toBe('function')
  })

  it('returned component should call args validator', () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      render: () => 0,
      validators: [my_validator],
    } as any)

    ;(my_component as any)()
    expect(my_validator.called).toBe(true)
  })

  it('returned component calls args validator with the correct args', () => {
    const my_validator = sinon.spy()
    const my_component = Component({
      render: () => 0,
      validators: [my_validator],
    } as any)

    my_component(42 as any)
    expect(my_validator.calledWith(42)).toBe(true)
  })

  it('every validator should be called', () => {
    const my_validator = sinon.spy()
    const my_validator2 = sinon.spy()
    const my_component = Component({
      render: () => 0,
      validators: [my_validator, my_validator2],
    } as any)

    my_component({ title: 42 })
    expect(my_validator.calledWith({ title: 42 })).toBe(true)
    expect(my_validator2.calledWith({ title: 42 })).toBe(true)
  })

  it('validation fail should not be caught', () => {
    expect(() => {
      const my_component = Component({
        render: () => 0,
        validators: [
          () => {
            throw new Error('Foo bar')
          },
        ],
      } as any)

      my_component({ title: 42 })
    }).toThrow('Foo bar')
  })

  it('there should be a bind function', () => {
    const my_component = Component({
      render: () => 0,
      validators: [],
    } as any)

    const bind = my_component({ title: 42 })
    expect(typeof bind).toBe('function')
  })

  it('bind function should throw when called without arguments', () => {
    expect(() => {
      const my_component = Component({
        render: () => 0,
        validators: [],
      } as any)
      const bind = my_component({ title: 42 })
      ;(bind as any)()
    }).toThrow('A d3 selection is required')
  })

  it('bind function throws selection error if selection is supplied', () => {
    expect(() => {
      const my_component = Component({
        render: () => 0,
        validators: [],
      } as any)
      const bind = my_component({ title: 42 })
      bind(d3.selection() as any)
    }).not.toThrow('A d3 selection is required')
  })

  it('bind function throws selection error if bad selection is given', () => {
    expect(() => {
      const my_component = Component({
        render: () => 0,
        validators: [],
      } as any)
      const bind = my_component({ title: 42 })
      const bad_selection = 'not a selection'
      bind(bad_selection as any)
    }).toThrow('A d3 selection is required')
  })

  it('render() is called when the component is rendered', () => {
    const { my_render } = call_test_component_with({ instance_args: {} })
    expect(my_render.called).toBe(true)
  })

  it('render() is called with correct arguments', () => {
    const { my_render, my_selection } = call_test_component_with({ instance_args: { title: 42 }, data: 'almafa' })
    expect(my_render.calledWith({ title: 42 }, my_selection, 'almafa')).toBe(true)
  })

  it('render() is called with correct arguments 2', () => {
    const { my_render, my_selection } = call_test_component_with({ instance_args: {}, data: [1] })
    expect(my_render.calledWith({}, my_selection, [1])).toBe(true)
  })

  it('if there is no init() function, a <span> is created', () => {
    call_test_component_with({ instance_args: {}, has_init: false })
    expect(d3.selectAll('span').size()).toBe(1)
  })

  it('if there is an init() function, it should be called', () => {
    const { my_init } = call_test_component_with({ instance_args: {}, has_init: true })
    expect(my_init.called).toBe(true)
  })

  it('if there is an init(), it is called with the correct arguments', () => {
    const { my_init, my_selection } = call_test_component_with({ instance_args: { shit: 'happens' }, has_init: true })
    expect(my_init.calledWith({ shit: 'happens' }, my_selection)).toBe(true)
  })

  it('if there is an init(), it is called with the correct arguments 2', () => {
    const { my_init, my_selection } = call_test_component_with({ instance_args: { bull: 'shit' }, has_init: true })
    expect(my_init.calledWith({ bull: 'shit' }, my_selection)).toBe(true)
  })

  it('if query is supplied, jq should be called', () => {
    const { jq } = call_test_component_with({ instance_args: { query: '' }, render_func: () => null })
    expect(jq.called).toBe(true)
  })

  it('jq should be called only if query is supplied', () => {
    const { jq } = call_test_component_with({ instance_args: {}, render_func: () => null })
    expect(jq.called).toBe(false)
  })

  it('if query is supplied, jq should be called with data and query', () => {
    const { jq } = call_test_component_with({
      instance_args: {
        query: 'foo',
      },
      data: 'bar',
      render_func: () => null,
    })
    expect(jq.calledWith('bar', 'foo')).toBe(true)
  })

  it('if query is supplied, jq should be called with data and query 2', () => {
    const { jq } = call_test_component_with({
      instance_args: { query: '. | foo' },
      data: 4,
      render_func: () => null,
    })
    expect(jq.calledWith(4, '. | foo')).toBe(true)
  })

  it('render should be called with query return value', () => {
    const jq_return_value = 42
    const render_func = sinon.spy()
    call_test_component_with({
      instance_args: { query: '. | foo' },
      data: 4,
      jq_return_value,
      render_func: render_func,
    })
    expect(render_func.calledWith(sinon.match.any, sinon.match.any, jq_return_value)).toBe(true)
  })

  it('render should be called with query return value 2', () => {
    const jq_return_value = 'foo'
    const render_func = sinon.spy()
    call_test_component_with({
      instance_args: { query: '. | asd' },
      data: 4,
      jq_return_value,
      render_func: render_func,
    })
    expect(render_func.calledWith(sinon.match.any, sinon.match.any, jq_return_value)).toBe(true)
  })

  it('execute_query calls reject', () => {
    const jq_error = new Error('Random error')
    mocks.jq = () => ({
      then: () => ({
        catch: (x: any) => x(jq_error),
      }),
    })
    const fail_handler = sinon.spy()
    execute_query(null as any, null as any)(fail_handler)(() => null)
    expect(fail_handler.calledWith(jq_error)).toBe(true)
  })

  const loader_test = (args: any) => {
    const jq = sinon.stub().resolves(args.jq_return_value)
    const my_loader = sinon.spy((_url: any, callback: any) => {
      if (args.no_resolve !== true) callback(null, args.fetched_value)
    })

    mocks.jq = jq
    mocks.d3Overrides = {
      json: my_loader,
      csv: () => null,
      ...args.d3,
    }

    const my_render = args.render_func === undefined ? sinon.spy() : args.render_func
    const my_component = Component({
      validators: [],
      render: my_render,
    } as any)
    if (args.instance_args === undefined) args.instance_args = {}
    args.instance_args.loader = args.loader
    const bind = my_component(args.instance_args)
    const my_selection = d3.selection()
    const render = bind(my_selection as any)
    render(args.data)
    return { my_loader, my_render, my_selection, instance_args: args.instance_args }
  }

  it('throws if invalid loader supplied', () => {
    expect(() => {
      loader_test({ loader: 'asdasdasd' })
    }).toThrow('Invalid loader')
  })

  it('doesnt throw if valid loader is supplied', () => {
    expect(() => {
      loader_test({ loader: 'csv' })
    }).not.toThrow('Invalid loader')
  })

  it('doesnt throw if valid loader is supplied 2', () => {
    expect(() => {
      loader_test({ loader: 'json' })
    }).not.toThrow('Invalid loader')
  })

  it('loader is called', () => {
    const { my_loader } = loader_test({ loader: 'json' })
    expect(my_loader.called).toBe(true)
  })

  it('loader is called with render args', () => {
    const data = 'foo'
    const { my_loader } = loader_test({ loader: 'json', data })
    expect(my_loader.calledWith(data)).toBe(true)
  })

  it('loader is called with render args 2', () => {
    const data = ['bar']
    const { my_loader } = loader_test({ loader: 'json', data })
    expect(my_loader.calledWith(data)).toBe(true)
  })

  it('loader is called with render args - file loader 1', () => {
    const data = ['bar']
    const my_file_loader_return = 42
    const my_file_loader = (_path: any, callback: any) => {
      callback(undefined, my_file_loader_return)
    }
    const { my_render } = loader_test({
      loader: 'text',
      data,
      instance_args: {
        is_file: true,
        file_loader: my_file_loader,
      },
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, my_file_loader_return, sinon.match.any)).toBe(true)
  })

  it('loader is called with render args - file loader 2', () => {
    const data = ['bar']
    const my_file_loader_return = '{"a": 42}'
    const my_file_loader = (_path: any, callback: any) => {
      callback(undefined, my_file_loader_return)
    }
    const { my_render } = loader_test({
      loader: 'json',
      data,
      instance_args: {
        is_file: true,
        file_loader: my_file_loader,
      },
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, { a: 42 }, sinon.match.any)).toBe(true)
  })

  it('loader is called with render args - file loader 3', () => {
    const data = ['bar']
    const my_file_loader_return = 'a,b\n' + '1,2\n'
    const my_file_loader = (_path: any, callback: any) => {
      callback(undefined, my_file_loader_return)
    }
    const { my_render } = loader_test({
      loader: 'csv',
      d3: { csvParse: () => [{ a: 1, b: 2 }] },
      data,
      instance_args: {
        is_file: true,
        file_loader: my_file_loader,
      },
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, [{ a: 1, b: 2 }], sinon.match.any)).toBe(true)
  })

  it('loader is called with render args - file loader 4', () => {
    const data = ['bar']
    const my_file_loader_return = 'a\tb\n' + '1\t2\n'
    const my_file_loader = (_path: any, callback: any) => {
      callback(undefined, my_file_loader_return)
    }
    const { my_render } = loader_test({
      loader: 'tsv',
      d3: { tsvParse: () => [{ a: 1, b: 2 }] },
      data,
      instance_args: {
        is_file: true,
        file_loader: my_file_loader,
      },
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, [{ a: 1, b: 2 }], sinon.match.any)).toBe(true)
  })

  it('loader is called with render args - text', () => {
    const data = ['bar']
    const { my_render } = loader_test({
      loader: 'text',
      d3: { text: (_: any, callback: any) => callback(undefined, 'Hello World') },
      data,
      instance_args: {
        is_file: false,
      },
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, 'Hello World', sinon.match.any)).toBe(true)
  })

  it('render is called with fetched data', () => {
    const fetched_value = { hello: 'world' }
    const { my_render, instance_args, my_selection } = loader_test({ loader: 'json', fetched_value })
    expect(my_render.calledWith(instance_args, my_selection, fetched_value)).toBe(true)
  })

  it('should show a spinner while data is loading', () => {
    loader_test({ loader: 'json', no_resolve: true })
    assert.equal(d3.selection().selectAll('.spinner').size(), 1)
  })

  it('spinner should disappear after resolve', () => {
    loader_test({ loader: 'json' })
    assert.equal(d3.selection().selectAll('.spinner').size(), 0)
  })

  it('while jq is being loaded, a spinner should be displayed', () => {
    call_test_component_with({ instance_args: { query: '' }, render_func: () => null, dont_execute_query: true })
    assert.equal(d3.selection().selectAll('.spinner').size(), 1)
  })

  it('spinner should disappear when query is finished', () => {
    call_test_component_with({ instance_args: { query: '' }, render_func: () => null })
    assert.equal(d3.selection().selectAll('.spinner').size(), 0)
  })

  it('render is called with init return value', () => {
    const my_element = 11
    const { my_render } = call_test_component_with({ element: my_element, has_init: true })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, my_element)).toBe(true)
  })

  it('calls format_value with proper arguments', () => {
    const state_handler = {
      subscribe: sinon.spy(),
      get_state: sinon.stub().returns({ x: '2' }),
    }
    const { format_value } = call_test_component_with({
      instance_args: {
        '${x}2': ['${y}'],
        state_handler: state_handler,
      },
    })
    expect(
      format_value.calledWith(
        {
          '${x}2': ['${y}'],
          state_handler: state_handler,
        },
        { x: '2' },
      ),
    ).toBe(true)
  })

  it('init should receive correct args', () => {
    const state_handler = {
      subscribe: sinon.spy(),
      get_state: sinon.stub().returns({ x: '2', y: 'foo' }),
    }
    const { my_init } = call_test_component_with({
      instance_args: {
        '${x}2': ['${y}'],
        state_handler: state_handler,
      },
      has_init: true,
      format_value_return: {
        '22': ['foo'],
        state_handler: state_handler,
      },
      format_value_return2: {
        '22': ['foo'],
        state_handler: state_handler,
      },
    })
    expect(
      my_init.calledWith({
        '22': ['foo'],
        state_handler: sinon.match.any,
      }),
    ).toBe(true)
  })

  it('render should receive correct args', () => {
    const state_handler = {
      subscribe: sinon.spy(),
      get_state: sinon.stub().returns({ x: '2', y: 'foo' }),
    }
    const { my_render } = call_test_component_with({
      instance_args: {
        '${x}2': ['${y}'],
        state_handler: state_handler,
      },
      has_init: true,
      format_value_return: {
        '22': ['foo'],
        state_handler: state_handler,
      },
      format_value_return2: {
        '22': ['foo'],
        state_handler: state_handler,
      },
    })
    expect(my_render.called).toBe(true)
    expect(
      my_render.calledWith({
        '22': ['foo'],
        state_handler: sinon.match.any,
      }),
    ).toBe(true)
  })

  it('subscribes to state changes', () => {
    const state_handler = {
      get_state: sinon.spy(),
      subscribe: sinon.spy(),
    }
    call_test_component_with({
      instance_args: {
        state_handler: state_handler,
      },
      has_init: true,
    })
    expect(state_handler.subscribe.called).toBe(true)
  })

  it('re-subscribes to state changes', () => {
    let callback: any
    const state_handler = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    call_test_component_with({
      instance_args: {
        state_handler: state_handler,
      },
      element: { remove: () => null },
      has_init: true,
    })
    callback(state_handler, callback)
    expect(state_handler.subscribe.calledTwice).toBe(true)
  })

  it('calls init with new arguments when variables change', () => {
    let callback: any
    const state_handler: any = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    const { my_init } = call_test_component_with({
      instance_args: {
        '${x}': '${y}',
        state_handler: state_handler,
      },
      has_init: true,
      element: { remove: () => null },
      format_value_return2: {
        foo: 'bar',
        state_handler: sinon.match.any,
      },
    })
    state_handler.get_state = () => ({ x: 'foo', y: 'bar' })
    callback(state_handler, callback)
    expect(
      my_init.calledWith(
        {
          foo: 'bar',
          state_handler: sinon.match.any,
        },
        sinon.match.any,
      ),
    ).toBe(true)
  })

  it('when re-init happens, old element is deleted', () => {
    let callback: any
    const element = { remove: sinon.spy() }
    const state_handler: any = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    call_test_component_with({
      instance_args: {
        '${x}': '${y}',
        state_handler: state_handler,
      },
      has_init: true,
      element: element,
      format_value_return2: {
        foo: 'bar',
        state_handler: sinon.match.any,
      },
    })
    state_handler.get_state = () => ({ x: 'foo', y: 'bar' })
    callback(state_handler, callback)
    expect(element.remove.called).toBe(true)
  })

  it('when re-init happens, re-render happens', () => {
    let callback: any
    const element = { remove: sinon.spy() }
    const state_handler: any = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    const { my_render } = call_test_component_with({
      instance_args: {
        '${x}': '${y}',
        state_handler: state_handler,
      },
      has_init: true,
      element: element,
      format_value_return2: {
        foo: 'bar',
        state_handler: sinon.match.any,
      },
    })
    state_handler.get_state = () => ({ x: 'foo', y: 'bar' })
    callback(state_handler, callback)
    expect(my_render.calledTwice).toBe(true)
  })

  it('correct element is passed to render when re-init happens', () => {
    let callback: any
    const element = { remove: sinon.spy() }
    const element2 = { remove: sinon.spy() }
    const state_handler: any = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    const { my_render } = call_test_component_with({
      instance_args: {
        '${x}': '${y}',
        state_handler: state_handler,
      },
      has_init: true,
      element: element,
      element2: element2,
      format_value_return2: {
        foo: 'bar',
        state_handler: {},
      },
    })
    state_handler.get_state = () => ({ x: 'foo', y: 'bar' })
    callback(state_handler, callback)
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, sinon.match.any, element2)).toBe(true)
  })

  it('returned component calls args validator with formatted args', () => {
    const format_value_return = sinon.spy()
    const { my_validator } = call_test_component_with({
      instance_args: {
        state_handler: {
          get_state: sinon.stub(),
          subscribe: sinon.stub(),
        },
      },
      format_value_return: format_value_return,
      format_value_return2: format_value_return,
    })
    expect(my_validator.alwaysCalledWith(format_value_return)).toBe(true)
  })

  it('doesnt re-subscribe to state if element was deleted by parent', () => {
    let callback: any
    const state_handler = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    call_test_component_with({
      instance_args: {
        state_handler: state_handler,
      },
      element: d3.select('body').append('div'),
      has_init: true,
    })
    d3.select('div').remove()
    callback(state_handler, callback)
    expect(state_handler.subscribe.calledOnce).toBe(true)
  })

  it('doenst re-init if element was deleted by parent component', () => {
    let callback: any
    const state_handler = {
      get_state: sinon.spy(),
      subscribe: sinon.spy((f: any) => {
        callback = f
      }),
    }
    const { my_init } = call_test_component_with({
      instance_args: {
        state_handler: state_handler,
      },
      element: d3.select('body').append('div'),
      has_init: true,
    })
    d3.select('div').remove()
    callback(state_handler, callback)
    expect(my_init.calledOnce).toBe(true)
  })

  it('calls format_value with proper data', () => {
    const state_handler = {
      subscribe: sinon.spy(),
      get_state: sinon.stub().returns({ x: '2' }),
    }
    const format_value_return = {
      state_handler: state_handler,
    }
    const my_data = 'this is data that has to be formatted'
    const { format_value } = call_test_component_with({
      instance_args: format_value_return,
      format_value_return: format_value_return,
      format_value_return2: format_value_return,
      data: my_data,
    })
    expect(format_value.calledWith(my_data)).toBe(true)
  })

  it('calls render with formatted data', () => {
    const data = 'this is not formatted'
    const state_handler = {
      subscribe: sinon.spy(),
      get_state: sinon.stub().returns({ x: '2', y: 'foo' }),
    }
    const format_value_return = {
      state_handler: state_handler,
    }
    const { my_render } = call_test_component_with({
      instance_args: format_value_return,
      format_value_return: format_value_return,
      format_value_return2: format_value_return,
      data: data,
    })
    expect(my_render.calledWith(sinon.match.any, sinon.match.any, format_value_return, sinon.match.any, data)).toBe(
      true,
    )
  })

  const test_error_messages = ['Totally random error', 'Another error here']

  test_error_messages.forEach((message) => {
    it(`error message when error happens during render() (${message})`, () => {
      const my_render = sinon.stub().throws(message)
      const { d3 } = call_test_component_with({
        render_func: my_render,
      })
      expect(my_render.called).toBe(true)
      assert.equal(d3.select('p.error').text(), `${message} [render]`)
    })

    it(`error message when error happens during init() (${message})`, () => {
      const my_init = sinon.stub().throws(message)
      const { d3 } = call_test_component_with({
        init_func: my_init,
        has_init: true,
      })
      expect(my_init.called).toBe(true)
      assert.equal(d3.select('p.error').text(), `${message} [bind]`)
    })
  })
})
