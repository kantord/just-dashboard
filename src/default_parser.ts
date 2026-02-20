import BoardComponent from './components/board/Board'
import ChartComponent from './components/chart/Chart'
import ColumnsComponent from './components/columns/Columns'
import DropdownComponent from './components/dropdown/Dropdown'
import RootComponent from './components/root/Root'
import RowsComponent from './components/rows/Rows'
import TextComponent from './components/text/Text'
import parse from './parser/parser'

const components: Record<string, unknown> = {
  root: RootComponent,
  columns: ColumnsComponent,
  rows: RowsComponent,
  board: BoardComponent,
  text: TextComponent,
  chart: ChartComponent,
  dropdown: DropdownComponent,
}

const test_parser = parse((component) => components[component] as any)

export default test_parser
