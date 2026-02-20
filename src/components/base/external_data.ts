import with_loader from './loaders'
import with_spinner from './spinner'
import type { D3Selection, ComponentArgs } from '../../types'

const load_external_data = (raw_data: string) => (loader_func: (source: string) => (callback: (...args: unknown[]) => void) => void, spinner_func: (func: (callback: (...args: unknown[]) => void) => void) => (callback: (...args: unknown[]) => void) => void) =>
  spinner_func(loader_func(raw_data))

const has_loader = (instance_args: ComponentArgs | undefined): boolean =>
  instance_args !== undefined && instance_args.hasOwnProperty('loader')

const handle_external_data = (instance_args: ComponentArgs, selection: D3Selection, raw_data: unknown) =>
  (resolve: (data: unknown) => void) =>
    has_loader(instance_args)
      ? load_external_data(raw_data as string)(
        with_loader(instance_args.loader as string, instance_args.file_loader as any,
          instance_args.is_file as boolean),
        with_spinner(selection))(
        (_: unknown, data: unknown) => resolve(data))
      : resolve(raw_data)

export default handle_external_data
