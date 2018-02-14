import Component from '../base_component.js'
import default_parser from '../../default_parser.js'
import { required } from '../../validators'


/**
 * A Component to contain the dashboard.
 * @module components/root
 * @param args Component arguments
 * @param args.title Document title (`<title>`)
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * dashboard "Hello World":
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "root",
 *   "args": {"title": "Hello World"},
 *   "data": [...]
 * }
 *
 * @example <caption>JavaScript format</caption>
 * import RootComponent from 'components/root'
 *
 * RootComponent({'title': 'Hello World'})(d3.selection())(...)
 *
 */
const RootComponent = Component({
  'validators': [required('title')],
  'init': (args, selection) => selection.select('title').text(args.title),
  'render': (args, selection, data) => {
    const body = selection.select('body')
    if (data instanceof Array) data.map((definition) => {
      const updated_definition = Object.assign({}, definition)
      updated_definition.args.state_handler = args.state_handler
      default_parser(updated_definition)(body.append('div').attr('class', 'ds--wrapper'))
    })
  }
})

export default RootComponent
