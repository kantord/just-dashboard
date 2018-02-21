import should from 'should' // eslint-disable-line no-unused-vars
const webdriver = require('selenium-webdriver'),
  By = webdriver.By

const firefox = require('selenium-webdriver/firefox')


const driver = new webdriver.Builder()
  .forBrowser('firefox')
  .setFirefoxOptions(new firefox.Options().addArguments('-headless'))
  .build()

describe('Integration test', function() {
  before(function(done) {
    const express = require('express')
    const app = express()
    app.use(express.static('lib'))
    app.listen(3000, function(err) {
      if (err) { return done(err) }
      done()
    })
  })

  beforeEach(function (done) {
    setTimeout(function(){
      done()
    }, 5000)
  })

  it('', function(done) {
    (async function() {
      try {
        await driver.get('http://localhost:3000/manual_test.html')
        const svgs = await driver.findElements(By.css('svg'))
        svgs.length.should.equal(78)
        const title_text = await driver.getTitle()
        title_text.should.equal('Cereals')
        const h1_text = await driver.findElement(By.css('h1')).getText()
        h1_text.should.equal('Cereals')
      } finally {
        await driver.quit()
      }
    })().then(done, done)
  })

})
