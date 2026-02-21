import { DashboardRenderer } from './components/DashboardRenderer'
import { DashboardProvider } from './context/DashboardContext'
import type { ComponentDef, FileLoader } from './types'
import './styles.css'

export function Dashboard({ definition, fileLoader }: { definition: ComponentDef; fileLoader?: FileLoader }) {
  return (
    <DashboardProvider fileLoader={fileLoader}>
      <DashboardRenderer definition={definition} />
    </DashboardProvider>
  )
}
