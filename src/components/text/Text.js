import Component from '../base_component.js'

const TextComponent = Component({
  'validators': [
    (args) => {if (!args.hasOwnProperty('tagName')) throw new Error('Tag name required')},
    (args) => {if (!args.tagName.match(/^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)) throw new Error('Invalid tag name')},
  ],
  'init': (args, selection) => selection.append(args.tagName),
  'render': (args, selection, data) => selection.select(args.tagName).text(data)
})

export default TextComponent
