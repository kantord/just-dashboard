import { required } from './validators'
import { regexp } from './validators'

describe('require validator', function() {
  it('should throw message when argument is not supplied', () => {
    (() => {required('title')({})})
      .should.throw('Argument \'title\' is required but not supplied.')
  })

  it('should not throw when argument is supplied', () => {
    (() => {required('title')({'title': 'asdf'})}).should.not.throw()
  })

  it('should throw message when argument is not supplied', () => {
    (() => {required('foo')({'title': ''})})
      .should.throw('Argument \'foo\' is required but not supplied.')
  })
})

describe('regexp validator', function() {
  it('should throw error when argument doesn\'t match regexp', () => {
    (() => {regexp('title', /bar/)({'title': 'foo'})})
      .should.throw('Argument \'title\' is invalid')
  })

  it('doesn\'t throw when format is valid', () => {
    (() => {regexp('title', /bar/)({'title': 'bar'})}).should.not.throw()
  })

  it('correct error message is shown', () => {
    (() => {regexp('class', /bar/)({'class': 'foo'})})
      .should.throw('Argument \'class\' is invalid')
  })

  it('correct regexp is used', () => {
    (() => {regexp('title', /[0-9]+/)({'title': '145'})}).should.not.throw()
  })

})
