import sinon from 'sinon'
import loader from './loader'

describe('Loader', () => {
  it('calls require with correct argument', () => {
    const fake_require = sinon.spy()
    loader(fake_require)('root')
    expect(fake_require.calledWith('../components/root')).toBe(true)
  })

  it('calls require with correct argument 2', () => {
    const fake_require = sinon.spy()
    loader(fake_require)('MyFancyComponent2')
    expect(fake_require.calledWith('../components/MyFancyComponent2')).toBe(true)
  })

  it('component returned', () => {
    const fake_component = sinon.spy()
    const fake_require = () => fake_component
    const component = loader(fake_require)('MyFancyComponent2')
    expect(component).toBe(fake_component)
  })
})
