import sinon from 'sinon'
import should from 'should'
import RootComponent from './Root'
import * as d3 from "d3";
import { JSDOM } from 'jsdom'
import assert from 'assert'

describe("Root component", () => {
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

  it("bind function should not throw selection error if selection is supplied", () => {
    (() => {
      const bind = RootComponent({"title": "foo bar"})
      const render = bind(d3.select(new JSDOM(``)))
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

  it("bind function should create render function", () => {
    const bind = RootComponent({"title": "example"})
	const dom = new JSDOM(`<!DOCTYPE html>`)
    const render = bind(d3.select(dom.window.document.documentElement))
    render.should.be.Function()
  })

  it("title text is set", () => {
    const bind = RootComponent({"title": "My example title"})
	const dom = new JSDOM(`<!DOCTYPE html>`)
    const render = bind(d3.select(dom.window.document.documentElement))
	render()
	assert.equal(dom.window.document.title, "My example title")
  })

})
