const create_spinner = (selection) =>
  selection.append('div')
    .attr('class', 'spinner sk-spinner sk-spinner-pulse')

const with_spinner = (selection) => (func) => (callback) => {
  const spinner = create_spinner(selection)
  return func((...args) => {
    spinner.remove()
    callback(...args)
  })
}

export default with_spinner
