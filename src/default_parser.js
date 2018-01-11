import parse from './parser/parser.js'
import loader from './loader/loader.js'
import RootComponent from './components/root/Root.js'
import TextComponent from './components/text/Text.js'

const default_parser = parse((component) => ({
  "root": RootComponent,
  "text": TextComponent,
}[component]))

export default default_parser
