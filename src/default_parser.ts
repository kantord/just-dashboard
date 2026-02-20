import parse from './parser/parser'
import RootComponent from './components/root/Root'
import TextComponent from './components/text/Text'
import ChartComponent from './components/chart/Chart'
import ColumnsComponent from './components/columns/Columns'
import RowsComponent from './components/rows/Rows'
import BoardComponent from './components/board/Board'
import DropdownComponent from './components/dropdown/Dropdown'

const components: Record<string, unknown> = {
  'root': RootComponent,
  'columns': ColumnsComponent,
  'rows': RowsComponent,
  'board': BoardComponent,
  'text': TextComponent,
  'chart': ChartComponent,
  'dropdown': DropdownComponent,
}

const test_parser = parse((component) => components[component] as any)

export default test_parser
