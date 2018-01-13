import * as d3 from 'd3'

const TextComponent = (args) => (selection) => {
  if (!args.hasOwnProperty('tagName')) throw new Error('Tag name required')
  if (!args.tagName.match(/^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)) throw new Error('Invalid tag name')
  if (!(selection instanceof d3.selection)) throw new Error('A d3 selection is required')
  const node = selection.append(args.tagName)

  return (data) => node.text(data)
}

export default TextComponent
