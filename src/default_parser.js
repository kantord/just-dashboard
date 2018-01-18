import parse from './parser/parser.js'
import RootComponent from './components/root/Root.js'
import TextComponent from './components/text/Text.js'
import ChartComponent from './components/chart/Chart.js'
import ColumnsComponent from './components/columns/Columns.js'
import RowsComponent from './components/rows/Rows.js'

const test_parser = parse((component) => ({
  'root': RootComponent,
  'columns': ColumnsComponent,
  'rows': RowsComponent,
  'text': TextComponent,
  'chart': ChartComponent,
}[component]))

export default test_parser
