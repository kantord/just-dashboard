import { useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { format_value } from '../../interpolation'
import type { ComponentDef, ComponentProps } from '../../types'
import { required } from '../../validators'
import { DashboardRenderer } from '../DashboardRenderer'

const validators = [required('title')]

export function Root({ args = {}, data }: ComponentProps) {
  const { variables } = useDashboard()
  const formatted = format_value({ ...args }, variables) as Record<string, unknown>

  for (const v of validators) v(formatted)

  const title = formatted.title as string
  const children = (data ?? []) as ComponentDef[]

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <>
      {children.map((def, i) => (
        <div key={i} className="ds--wrapper">
          <DashboardRenderer definition={def} />
        </div>
      ))}
    </>
  )
}
