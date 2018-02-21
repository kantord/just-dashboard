import path from 'path'
const Browser = require('zombie')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack.test.config.js')
const port = 3000
let server


describe('Integration test', function() {
  before((done) => {
    server = new WebpackDevServer(webpack(config));
    server.listen(port, 'localhost', function (err) {
      if (err) {
        console.log(err);
      }
      console.log('WebpackDevServer listening at localhost:', port);
      done()
    })
  })

  after((done) => {
    server.close(done)
  })


  it('jq + d3 + url loading', function(done) {
    const browser = new Browser({ site: 'http://localhost:3000' })
    browser.visit('lib/test_page.html', () => {
      console.log(browser.location.href);
      console.log(browser.html())
      done()
    });
  })

})
