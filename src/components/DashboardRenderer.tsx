import type { ComponentDef, ComponentProps } from '../types'
import { Board } from './board/Board'
import { Chart } from './chart/Chart'
import { Columns } from './columns/Columns'
import { Dropdown } from './dropdown/Dropdown'
import { Root } from './root/Root'
import { Rows } from './rows/Rows'
import { Text } from './text/Text'

const COMPONENTS: Record<string, React.ComponentType<ComponentProps>> = {
  root: Root,
  text: Text,
  chart: Chart,
  dropdown: Dropdown,
  columns: Columns,
  rows: Rows,
  board: Board,
}

export function DashboardRenderer({ definition }: { definition: ComponentDef }) {
  const Component = COMPONENTS[definition.component]
  if (!Component) return <p className="error">Unknown component: {definition.component}</p>
  return <Component args={definition.args} data={definition.data} />
}
