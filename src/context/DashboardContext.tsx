import { createContext, useCallback, useContext, useReducer } from 'react'
import type { FileLoader } from '../types'

interface DashboardState {
  variables: Record<string, unknown>
}

type Action =
  | { type: 'SET_VARIABLE'; name: string; value: unknown }
  | { type: 'INIT_VARIABLE'; name: string; value: unknown }
  | { type: 'RESET' }

function reducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case 'SET_VARIABLE':
      return { ...state, variables: { ...state.variables, [action.name]: action.value } }
    case 'INIT_VARIABLE':
      if (state.variables[action.name] !== undefined) return state
      return { ...state, variables: { ...state.variables, [action.name]: action.value } }
    case 'RESET':
      return { variables: {} }
    default:
      return state
  }
}

interface DashboardContextValue {
  variables: Record<string, unknown>
  setVariable: (name: string, value: unknown) => void
  initVariable: (name: string, value: unknown) => void
  fileLoader?: FileLoader
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children, fileLoader }: { children: React.ReactNode; fileLoader?: FileLoader }) {
  const [state, dispatch] = useReducer(reducer, { variables: {} })

  const setVariable = useCallback((name: string, value: unknown) => {
    dispatch({ type: 'SET_VARIABLE', name, value })
  }, [])

  const initVariable = useCallback((name: string, value: unknown) => {
    dispatch({ type: 'INIT_VARIABLE', name, value })
  }, [])

  return (
    <DashboardContext.Provider value={{ variables: state.variables, setVariable, initVariable, fileLoader }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider')
  return ctx
}
