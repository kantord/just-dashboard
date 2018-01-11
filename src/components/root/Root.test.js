import should from 'should'
import RootComponent from './Root'
import * as d3 from "d3"
import assert from 'assert'
import sinon from 'sinon'
var jsdom = require('mocha-jsdom')

describe("Root component", function() {
  jsdom({"useEach": true})

  it("passing empty data should throw", () => {
    (() => {RootComponent({})()()}).should.throw("Title required")
  })

  it("passing title should not throw title error", () => {
    (() => {RootComponent({"title": "foo bar"})()()})
      .should.not.throw("Title required")
  })

  it("passing args should return a function", () => {
    RootComponent({"title": "foo bar"}).should.be.a.Function()
  })

  it("bind function should throw when called without arguments", () => {
    (() => {
      const bind = RootComponent({"title": "foo bar"})
      const render = bind()
      render()
    }).should.throw("A d3 selection is required")
  })

  it("bind function should not throw selection error if selection is supplied", function() {
    (() => {
      const bind = RootComponent({"title": "foo bar"})
      const d3 = require('d3')
      const render = bind(d3.selection())
      render()
    }).should.not.throw()
  })

  it("bind function should throw selection error if bad selection is supplied", () => {
    (() => {
      const bind = RootComponent({"title": "foo bar"})
      const render = bind(42)
      render()
    }).should.throw("A d3 selection is required")
  })

  it("bind function should create render function", function() {
    const bind = RootComponent({"title": "example"})
    const d3 = require('d3')
    const render = bind(d3.selection())
    render.should.be.Function()
  })

  it("title text is set", function() {
    document.head.innerHTML = "<title>foobar</title>"
    const bind = RootComponent({"title": "My example title"})
    const d3 = require('d3')
    const render = bind(d3.selection())
	render()
    assert.equal(d3.selection().select("title").text(), "My example title")
  })

  it("render child element", function() {
    document.head.innerHTML = "<title>foobar</title>"
	const RootComponentInjector = require('inject-loader!./Root')
	const RootComponent = RootComponentInjector({
		'../../default_parser.js': (_) => (selection) => selection.append("h1").text("My title")
	}).default
    const bind = RootComponent({"title": "I don't care"})
    const d3 = require('d3')
    const render = bind(d3.selection())
	render([
	  {
	  	"component": "text",
		"args": {"tagName": "h1"},
		"data": "My title"
	  }
	])
    assert.equal(d3.selection().select("h1").text(), "My title")
  })

  it("render child element only if there is a child", function() {
    document.head.innerHTML = "<title>foobar</title>"
    const bind = RootComponent({"title": "I don't care"})
    const d3 = require('d3')
    const render = bind(d3.selection())
	render([])
    assert.equal(d3.selection().selectAll("h1").size(), 0)
  })

  it("render each child", function() {
    document.head.innerHTML = "<title>foobar</title>"
	const RootComponentInjector = require('inject-loader!./Root')
	const RootComponent = RootComponentInjector({
		'../../default_parser.js': (_) => (selection) => selection.append("h1").text("My title")
	}).default
    const bind = RootComponent({"title": "I don't care"})
    const d3 = require('d3')
    const render = bind(d3.selection())
	render([
	  {
	  	"component": "text",
		"args": {"tagName": "h1"},
		"data": "My title"
	  },
	  {
	  	"component": "text",
		"args": {"tagName": "h2"},
		"data": "My secondary header"
	  }
	])
    assert.equal(d3.selection().selectAll("h1").size(), 2)
  })

  it("renders parsed component", function() {
	document.head.innerHTML = "<title>foobar</title>"
	const RootComponentInjector = require('inject-loader!./Root.js')
	const RootComponent = RootComponentInjector({
		'../../default_parser.js': (_) => (selection) => selection.append("b").text("")
	}).default
    const bind = RootComponent({"title": ""})
    const d3 = require('d3')
    const render = bind(d3.selection())
	render([
	  {
	  	"component": "text",
		"args": {"tagName": "h1"},
		"data": "My title"
	  }
	])
    assert.equal(d3.selection().selectAll("b").size(), 1)
  })

  it("integration test", () => {
    document.head.innerHTML = "<title>foobar</title>"
    const default_parser = require("../../default_parser.js").default
    const bind = default_parser({
        "component": "root",
        "args": {
            "title": "Another example title"
        },
        "data": [
          {
            "component": "text",
            "args": {"tagName": "p"},
            "data": "Almafa"
          }
        ]
    })
    const render = bind(d3.selection())
    assert.equal(d3.selection().select("p").text(), "Almafa")
  })


})
