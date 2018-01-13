import Component from '../base_component.js'
import { required } from '../../validators'
import { regexp } from '../../validators'

const TextComponent = Component({
  'validators': [required('tagName'), regexp('tagName', /^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)],
  'init': (args, selection) => selection.append(args.tagName),
  'render': (args, selection, data) => selection.select(args.tagName).text(data)
})

export default TextComponent
