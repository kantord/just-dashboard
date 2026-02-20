import * as validators from '../validators'
import create_state_handler from '../state_handler'
import type { D3Selection, ComponentArgs, FileLoader } from '../types'

type ComponentFunction = (args: ComponentArgs) => (selection: D3Selection) => (data: unknown) => void
type ComponentLoader = (name: string) => ComponentFunction

const parse = (component_loader: ComponentLoader) => (input: Record<string, unknown>, file_loader?: FileLoader) => {
  if (!(typeof input === 'object')) throw new Error('An object is required')
  validators.required('component')(input)
  validators.regexp('component', /^[A-z]\w*$/)(input)

  const component = component_loader(input.component as string)
  const args: ComponentArgs = Object.assign({}, input.args as ComponentArgs)
  if (input.component === 'root') {
    args.state_handler = create_state_handler()
    args.file_loader = file_loader
  }
  const bind = component(args)

  return (selection: D3Selection) => {
    const update = bind(selection)
    update(input.data)

    return update
  }
}

export default parse
