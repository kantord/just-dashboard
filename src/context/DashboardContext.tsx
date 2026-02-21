import { parseAsString, useQueryStates } from 'nuqs'
import { createContext, useCallback, useContext, useMemo } from 'react'
import type { VariableDef } from '../extractVariableDefs'
import type { FileLoader } from '../types'

interface DashboardContextValue {
  variables: Record<string, string>
  setVariable: (name: string, value: string) => void
  initVariable: (name: string, value: string) => void
  fileLoader?: FileLoader
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({
  children,
  fileLoader,
  variableDefs = [],
}: {
  children: React.ReactNode
  fileLoader?: FileLoader
  variableDefs?: VariableDef[]
}) {
  const parsers = useMemo(() => {
    const p: Record<string, ReturnType<typeof parseAsString.withDefault>> = {}
    for (const def of variableDefs) {
      p[def.name] = parseAsString.withDefault(def.defaultValue)
    }
    return p
  }, [variableDefs])

  const [variables, setQueryStates] = useQueryStates(parsers)

  const setVariable = useCallback(
    (name: string, value: string) => {
      setQueryStates({ [name]: value })
    },
    [setQueryStates],
  )

  const initVariable = useCallback((_name: string, _value: string) => {
    // no-op: nuqs handles defaults via withDefault()
  }, [])

  return (
    <DashboardContext.Provider value={{ variables, setVariable, initVariable, fileLoader }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider')
  return ctx
}
