import type { D3Selection } from '../../types'

const create_spinner = (selection: D3Selection) =>
  selection.append('div').attr('class', 'spinner sk-spinner sk-spinner-pulse')

const with_spinner =
  (selection: D3Selection) =>
  (func: (callback: (...args: unknown[]) => void) => void) =>
  (callback: (...args: unknown[]) => void) => {
    const spinner = create_spinner(selection)
    return func((...args: unknown[]) => {
      spinner.remove()
      callback(...args)
    })
  }

export default with_spinner
