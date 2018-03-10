const express = require('express')
const app = express()
const webshot = require('webshot');

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
webshot('http://localhost:3000/screenshot.html', process.argv[2], options, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Screenshot created')
  }
  process.exit()
})
