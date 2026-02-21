export type FileLoader = (path: string, callback: (error: unknown, data: string) => void) => void

export interface ComponentDef {
  component: string
  args?: Record<string, unknown>
  data?: unknown
}

export interface ComponentProps {
  args?: Record<string, unknown>
  data?: unknown
}
