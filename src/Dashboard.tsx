import { useMemo } from 'react'
import { DashboardRenderer } from './components/DashboardRenderer'
import { DashboardProvider } from './context/DashboardContext'
import { extractVariableDefs } from './extractVariableDefs'
import type { ComponentDef, FileLoader } from './types'
import './styles.css'

export function Dashboard({ definition, fileLoader }: { definition: ComponentDef; fileLoader?: FileLoader }) {
  const variableDefs = useMemo(() => extractVariableDefs(definition), [definition])

  return (
    <DashboardProvider fileLoader={fileLoader} variableDefs={variableDefs}>
      <DashboardRenderer definition={definition} />
    </DashboardProvider>
  )
}
