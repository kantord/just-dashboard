const parse = (component_loader) => (input) => {
  if (!(typeof input === 'object')) throw new Error('An object is required')
  if (!(input.hasOwnProperty('component'))) throw new Error('Component name required')
  if (!input.component.match(/^[A-z]\w*$/)) throw new Error('Invalid component name')

  const component = component_loader(input.component)
  const bind = component(input.args)

  return (selection) => {
    const update = bind(selection)
    update(input.data)

    return update
  }
}

export default parse
