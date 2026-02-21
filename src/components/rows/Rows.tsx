import type { ComponentDef, ComponentProps } from '../../types'
import { DashboardRenderer } from '../DashboardRenderer'

export function Rows({ data }: ComponentProps) {
  const children = (data ?? []) as ComponentDef[]

  return (
    <div className="ds--rows">
      {children.map((def, i) => (
        <div key={i} className="ds--row">
          <DashboardRenderer definition={def} />
        </div>
      ))}
    </div>
  )
}
