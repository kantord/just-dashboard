import { useDashboard } from '../../context/DashboardContext'
import { format_value } from '../../interpolation'
import type { ComponentDef, ComponentProps } from '../../types'
import { DashboardRenderer } from '../DashboardRenderer'

export function Columns({ args = {}, data }: ComponentProps) {
  const { variables } = useDashboard()
  const formatted = format_value({ ...args }, variables) as Record<string, unknown>
  const columnCount = (formatted.columns as number) ?? 2
  const children = (data ?? []) as ComponentDef[]

  return (
    <div className="ds--columns" data-ds--columns={columnCount}>
      {children.map((def, i) => (
        <div key={i} className="ds--column">
          <DashboardRenderer definition={def} />
        </div>
      ))}
    </div>
  )
}
