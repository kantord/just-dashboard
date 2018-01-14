const Wrapped = (wrapper) => (component) => {
  if (!(typeof wrapper === 'function')) throw new Error('Invalid wrapper function')
  if (!(typeof component === 'function')) throw new Error('A component is required')

  return (args) => (selection) => {
    return component(args)(wrapper(args, selection))
  }
}

export default Wrapped
