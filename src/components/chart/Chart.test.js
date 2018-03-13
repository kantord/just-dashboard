import should from 'should' // eslint-disable-line no-unused-vars
import sinon from 'sinon'
const ChartComponentInjector = require('inject-loader!./Chart')


describe('ChartComponent', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  const call_render_with = (args) => {
    const fake_generate = sinon.spy()
    const ChartComponent = ChartComponentInjector(
      {'billboard.js': {'bb': {'generate': fake_generate}}}).default
    const bind = ChartComponent(args.component_args)
    const d3 = require('d3')
    const selection = d3.selection()
    selection.append = () => ({'node': () => 'magic'})
    const render = bind(selection)
    render(args.render_args)

    return { fake_generate, selection }
  }

  it('billboard called', function() {
    const { fake_generate } = call_render_with({
      'component_args': {'type': 'spline'},
      'render_args': {'columns': [
        ['x', 1, 2, 3],
        ['y', 1, 2, 3],
      ]}
    })
    fake_generate.should.be.called()
  })

  it('billboard called with correct arguments', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'spline'},
      'render_args': {'columns': [
        ['x', 1, 2, 3],
        ['y', 1, 2, 3],
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'spline',
        'columns': [
          ['x', 1, 2, 3],
          ['y', 1, 2, 3],
        ]
      }
    })
  })

  it('billboard called with correct arguments 2', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie'},
      'render_args': {'columns': [
        ['a', 1, 2, 3],
        ['b', 1, 2, 3],
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'pie',
        'columns': [
          ['a', 1, 2, 3],
          ['b', 1, 2, 3],
        ]
      }
    })
  })

  it('billboard called with correct arguments (stacked)', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'columns': [
        ['a', 1, 2, 3],
        ['b', 1, 2, 3],
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'pie',
        'groups': [['a', 'b']],
        'columns': [
          ['a', 1, 2, 3],
          ['b', 1, 2, 3],
        ]
      }
    })
  })

  it('billboard called with correct arguments (stacked 2)', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'columns': [
        ['bar', 1, 2, 3],
        ['foo', 1, 2, 3],
        ['x', 1, 2, 3],
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'pie',
        'groups': [['bar', 'foo', 'x']],
        'columns': [
          ['bar', 1, 2, 3],
          ['foo', 1, 2, 3],
          ['x', 1, 2, 3],
        ]
      }
    })
  })

  it('billboard called with correct arguments (stacked, rows)', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'pie', 'stacked': true},
      'render_args': {'rows': [
        ['foo', 'bar'],
        [0, 1]
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'pie',
        'groups': [['foo', 'bar']],
        'rows': [
          ['foo', 'bar'],
          [0, 1]
        ]
      }
    })
  })

  it('should take rows as well', function() {
    const { fake_generate, selection } = call_render_with({
      'component_args': {'type': 'bar'},
      'render_args': {'rows': [
        [1, 2, 3],
        [1, 2, 3],
      ]}
    })
    fake_generate.should.be.calledWith({
      'bindto': selection.append().node(),
      'data': {
        'type': 'bar',
        'rows': [
          [1, 2, 3],
          [1, 2, 3],
        ]
      }
    })
  })

})
