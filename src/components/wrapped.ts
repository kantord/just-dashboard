import type { ComponentArgs, D3Selection } from '../types'

type WrapperFunction = (args: ComponentArgs, selection: D3Selection) => D3Selection
type ComponentFunction = (args: ComponentArgs) => (selection: D3Selection) => (data: unknown) => void

const Wrapped = (wrapper: WrapperFunction) => (component: ComponentFunction) => {
  if (!(typeof wrapper === 'function')) throw new Error('Invalid wrapper function')
  if (!(typeof component === 'function')) throw new Error('A component is required')

  return (args: ComponentArgs) => (selection: D3Selection) => {
    return component(args)(wrapper(args, selection))
  }
}

export default Wrapped
