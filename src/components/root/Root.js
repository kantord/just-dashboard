import Component from '../base_component.js'
import default_parser from '../../default_parser.js'
import { required } from '../../validators'

const RootComponent = Component({
  'validators': [required('title')],
  'init': (args, selection) => selection.select('title').text(args.title),
  'render': (args, selection, data) => {
    if (data instanceof Array) data.map((definition) => default_parser(definition)(selection))
  }
})

export default RootComponent
