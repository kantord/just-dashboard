import parse from './parser/parser.js'
import RootComponent from './components/root/Root.js'
import TextComponent from './components/text/Text.js'
import ChartComponent from './components/chart/Chart.js'
import ColumnsComponent from './components/columns/Columns.js'
import RowsComponent from './components/rows/Rows.js'
import BoardComponent from './components/board/Board.js'
import DropdownComponent from './components/dropdown/Dropdown.js'
import TabsComponent from './components/tabs/Tabs.js'

const test_parser = parse((component) => ({
  'root': RootComponent,
  'columns': ColumnsComponent,
  'rows': RowsComponent,
  'board': BoardComponent,
  'text': TextComponent,
  'chart': ChartComponent,
  'dropdown': DropdownComponent,
  'tabs': TabsComponent,
}[component]))

export default test_parser
