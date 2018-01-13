import Component from '../base_component.js'
import default_parser from '../../default_parser.js'

const RootComponent = Component({
  'validators': [
    (args) => {if (!args.hasOwnProperty('title')) throw new Error('Title required')}
  ],
  'init': (args, selection) => selection.select('title').text(args.title),
  'render': (args, selection, data) => {
    if (data instanceof Array) data.map((definition) => default_parser(definition)(selection))
  }
})

export default RootComponent
