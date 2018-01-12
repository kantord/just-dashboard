import should from 'should'
import * as d3 from "d3"
import assert from 'assert'
import sinon from 'sinon'
const ChartComponentInjector = require('inject-loader!./Chart')
var jsdom = require('mocha-jsdom')


describe("ChartComponent", function() {
  jsdom({"useEach": true})

  it("passing empty data should throw", () => {
    (() => {
      const ChartComponent = ChartComponentInjector({"billboard.js": () => 0}).default
      ChartComponent({})()()
    }).should.throw("Type required")
  })

  it("passing chart type should not throw missing type error", () => {
    (() => {
      const ChartComponent = ChartComponentInjector({"billboard.js": () => 0}).default
      ChartComponent({"type": "spline"})()()
    }).should.not.throw("Type required")
  })

  it("passing args should return a function", () => {
      const ChartComponent = ChartComponentInjector({"billboard.js": () => 0}).default
      ChartComponent({"type": "spline"}).should.be.a.Function()
  })

it("bind function should throw when called without arguments", () => {
  (() => {
    const ChartComponent = ChartComponentInjector({"billboard.js": () => 0}).default
    const bind = ChartComponent({"type": "donut"})
    const render = bind()
    render()
  }).should.throw("A d3 selection is required")
})

it("bind function should not throw selection error if selection is supplied", function() {
  (() => {
    const ChartComponent = ChartComponentInjector({"billboard.js": {"bb": {"generate": sinon.stub()}}}).default
    const bind = ChartComponent({"type": "spline"})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render({"columns": []})
  }).should.not.throw()
})

  it("billboard called", function() {
	const fake_generate = sinon.spy()
	const ChartComponent = ChartComponentInjector({"billboard.js": {"bb": {"generate": fake_generate}}}).default
	const bind = ChartComponent({"type": "spline"})
	const d3 = require('d3')
	const render = bind(d3.selection())
	render({"columns": [
	  ["x", 1, 2, 3],
	  ["y", 1, 2, 3],
	]})
	fake_generate.should.be.called()
  })

  it("billboard called with correct arguments", function() {
	const fake_generate = sinon.spy()
	const ChartComponent = ChartComponentInjector({"billboard.js": {"bb": {"generate": fake_generate}}}).default
	const bind = ChartComponent({"type": "spline"})
	const d3 = require('d3')
	const my_selection = d3.selection()
	my_selection.append = () => ({"node": () => "magic"})
	const render = bind(my_selection)
	render({"columns": [
	  ["x", 1, 2, 3],
	  ["y", 1, 2, 3],
	]})
	fake_generate.should.be.calledWith({
	  "bindto": my_selection.append().node(),
	  "data": {
		"type": "spline",
		"columns": [
		  ["x", 1, 2, 3],
		  ["y", 1, 2, 3],
		]
	  }
	})
  })

  it("billboard called with correct arguments 2", function() {
	const fake_generate = sinon.spy()
	const ChartComponent = ChartComponentInjector({"billboard.js": {"bb": {"generate": fake_generate}}}).default
	const bind = ChartComponent({"type": "pie"})
	const d3 = require('d3')
	const my_selection = d3.selection()
	my_selection.append = () => ({"node": () => "magic"})
	const render = bind(my_selection)
	render({"columns": [
	  ["a", 1, 2, 3],
	  ["b", 1, 2, 3],
	]})
	fake_generate.should.be.calledWith({
	  "bindto": my_selection.append().node(),
	  "data": {
		"type": "pie",
		"columns": [
		  ["a", 1, 2, 3],
		  ["b", 1, 2, 3],
		]
	  }
	})
  })

})
