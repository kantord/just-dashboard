import should from 'should'
import loader from './loader'
import sinon from 'sinon'
var jsdom = require('mocha-jsdom')


describe("Loader", function() {
  jsdom()

  it("calls require with correct argument", () => {
    const fake_require = sinon.spy()
    loader(fake_require)("root")
    fake_require.should.be.calledWith("../components/root")
  })

  it("calls require with correct argument 2", () => {
    const fake_require = sinon.spy()
    loader(fake_require)("MyFancyComponent2")
    fake_require.should.be.calledWith("../components/MyFancyComponent2")
  })

 	it("component returned", () => {
		const fake_component = sinon.spy()
    const fake_require = (whatever) => fake_component
    const component = loader(fake_require)("MyFancyComponent2")
		component.should.equal(fake_component)
  })
})
