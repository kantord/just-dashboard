import { required, regexp } from './validators'

describe('require validator', () => {
  it('should throw message when argument is not supplied', () => {
    expect(() => { required('title')({}) })
      .toThrow('Argument \'title\' is required but not supplied.')
  })

  it('should not throw when argument is supplied', () => {
    expect(() => { required('title')({ 'title': 'asdf' }) }).not.toThrow()
  })

  it('should throw message when argument is not supplied', () => {
    expect(() => { required('foo')({ 'title': '' }) })
      .toThrow('Argument \'foo\' is required but not supplied.')
  })
})

describe('regexp validator', () => {
  it('should throw error when argument doesn\'t match regexp', () => {
    expect(() => { regexp('title', /bar/)({ 'title': 'foo' }) })
      .toThrow('Argument \'title\' is invalid')
  })

  it('doesn\'t throw when format is valid', () => {
    expect(() => { regexp('title', /bar/)({ 'title': 'bar' }) }).not.toThrow()
  })

  it('correct error message is shown', () => {
    expect(() => { regexp('class', /bar/)({ 'class': 'foo' }) })
      .toThrow('Argument \'class\' is invalid')
  })

  it('correct regexp is used', () => {
    expect(() => { regexp('title', /[0-9]+/)({ 'title': '145' }) }).not.toThrow()
  })
})
