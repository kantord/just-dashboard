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
    app.use(express.static('dist'))
    app.listen(3000, function(err) {
      if (err) { return done(err) }
      done()
    })
  })

  beforeEach(function (done) {
    setTimeout(function(){
      done()
    }, 500)
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
        const original_elements = await driver.findElements(
          By.css('svg'))
        const original_element_count = original_elements.length
        await driver.findElement(By.css('select option:nth-child(2)')).click()
        const new_elements = await driver.findElements(
          By.css('svg'))
        const new_element_count = new_elements.length
        original_element_count.should.equal(new_element_count)
      } finally {
        await driver.quit()
      }
    })().then(done, done)
  })

})
