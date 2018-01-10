import should from 'should'
import RootComponent from './Root'
import * as d3 from "d3";
import assert from 'assert'
var jsdom = require('mocha-jsdom')

describe("Root component", function() {
  jsdom()

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

})
