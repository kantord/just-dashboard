import parse from './parser/parser.js'
import RootComponent from './components/root/Root.js'
import ColumnsComponent from './components/columns/Columns.js'
import TextComponent from './components/text/Text.js'

const test_parser = parse((component) => ({
  'root': RootComponent,
  'columns': ColumnsComponent,
  'text': TextComponent,
}[component]))

export default test_parser
