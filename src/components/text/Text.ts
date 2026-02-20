import { regexp, required } from '../../validators'
import Component from '../base'
import './Text.scss'

const TextComponent = Component({
  validators: [required('tagName'), regexp('tagName', /^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)],
  init: (args, selection) => {
    const item = selection.append(args.tagName as string).attr('class', 'ds--text')
    if (Object.hasOwn(args, 'align')) item.attr('data-align', args.align as string)

    return item
  },
  render: (_args, _selection, data, item) => item.text(data as string),
})

export default TextComponent
