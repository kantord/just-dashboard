import * as validators from '../validators.js'
import create_state_handler from '../state_handler.js'

/** Creates a function that parses a JSON component and compiles it into a Javascript component
  * @param {Function} component_loader - A function that can load components*/
const parse = (component_loader) => (input) => {
  if (!(typeof input === 'object')) throw new Error('An object is required')
  validators.required('component')(input)
  validators.regexp('component', /^[A-z]\w*$/)(input)

  const component = component_loader(input.component)
  const args = Object.assign({}, input.args)
  args.state_handler = create_state_handler()
  const bind = component(args)

  return (selection) => {
    const update = bind(selection)
    update(input.data)

    return update
  }
}

export default parse
