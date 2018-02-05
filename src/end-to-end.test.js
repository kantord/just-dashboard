import assert from 'assert'
import * as d3 from 'd3'
import {json_parser, yaml_parser} from './index.js'


describe('End-to-end test', function() {
  beforeEach(function () {
    this.jsdom = require('jsdom-global')()
  })

  afterEach(function () {
    this.jsdom()
  })

  it('renders root and text component', function(done) {
    const selection = d3.selection()
    const parsed_yaml = yaml_parser(`dashboard "Hello World":
  - h1 text: Hello
  - h2 text:
    - attr:query: '[.[0], .[1]] | join(" ")'
    - data: ["Hello", "World!"]`)
    json_parser(parsed_yaml)(selection)
    setTimeout(function() {
      assert.equal(selection.select('h1').text(), 'Hello')
      assert.equal(selection.select('h2').text(), 'Hello World!')
      done()
    }, 200)
  })
})
