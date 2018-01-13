import parse from './parser/parser.js'
import RootComponent from './components/root/Root.js'
import TextComponent from './components/text/Text.js'
import ChartComponent from './components/chart/Chart.js'

const test_parser = parse((component) => ({
  'root': RootComponent,
  'text': TextComponent,
  'chart': ChartComponent,
}[component]))

export default test_parser
