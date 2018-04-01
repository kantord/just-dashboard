import with_loader from './loaders'
import with_spinner from './spinner'

const load_external_data = (raw_data) => (loader_func, spinner_func) =>
  spinner_func(loader_func(raw_data))

const has_loader = (instance_args) =>
  instance_args !== undefined && instance_args.hasOwnProperty('loader')

const handle_external_data = (instance_args, selection, raw_data) =>
  (resolve) =>
    has_loader(instance_args)
      ? load_external_data(raw_data)(
        with_loader(instance_args.loader, instance_args.file_loader,
          instance_args.is_file),
        with_spinner(selection))(
        (_, data) => resolve(data))
      : resolve(raw_data)

export default handle_external_data
