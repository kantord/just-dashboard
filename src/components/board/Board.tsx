import type { ComponentDef, ComponentProps } from '../../types'
import { DashboardRenderer } from '../DashboardRenderer'

export function Board({ data }: ComponentProps) {
  const children = (data ?? []) as ComponentDef[]

  return (
    <div className="ds--board">
      {children.map((def, i) => (
        <div key={i}>
          <DashboardRenderer definition={def} />
        </div>
      ))}
    </div>
  )
}
