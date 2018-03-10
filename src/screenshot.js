/* eslint-disable no-console */
const express = require('express')
const app = express()
const webshot = require('webshot')

console.log('Starting server')
app.use(express.static('lib'))
app.listen(3000)
console.log('Server started')

const options = {
  screenSize: {
    width: 640,
    height: 500
  },
  captureSelector: 'body>*',
  defaultWhiteBackground: true,
  renderDelay: 3000,
  errorIfJSException: true
}

console.log('Creating screenshot')
const url ='http://localhost:3000/screenshot.html'
webshot(url, process.argv[2], options, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Screenshot created')
  }
  process.exit()
})
