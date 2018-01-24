import Component from '../base_component.js'
import { required } from '../../validators'
import { regexp } from '../../validators'
import './Text.scss'

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
