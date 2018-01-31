import Component from '../base_component.js'
import { required } from '../../validators'
import { regexp } from '../../validators'
import './Text.scss'

/**
 * Creates a text element with the specified HTML tag name.
 * @module components/text
 * @param args Component arguments
 * @param args.tagName HTML tag name (i.e. div, p, h1, h2, etc.)
 * @returns {function}
 *
 * @example <caption>YAML format</caption>
 * h1 text:
 *   ...
 *
 * @example
 * p text:
 *   ...
 *
 * @example <caption>JSON format</caption>
 * {
 *   "component": "text",
 *   "args": {"tagName": "p"},
 *   "data": [...]
 * }
 *
 * @example <caption>JavaScript format</caption>
 * import TextComponent from 'components/text'
 *
 * TextComponent({'tagName': 'p'})(d3.selection())(...)
 *
 *
 */
const TextComponent = Component({
  'validators': [required('tagName'), regexp('tagName', /^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)],
  'init': (args, selection) => {
    const item = selection.append(args.tagName).attr('class', 'ds--text')
    if (args.hasOwnProperty('align'))
      item.attr('data-align', args.align)

    return item
  },
  'render': (args, selection, data, item) => item.text(data)
})

export default TextComponent
