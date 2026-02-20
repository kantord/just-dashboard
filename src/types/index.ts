import type * as d3 from 'd3'

export type D3Selection = d3.Selection<any, any, any, any>

export interface StateHandler {
  get_state: () => Record<string, unknown>
  set_variable: (name: string, value: unknown) => void
  init_variable: (name: string, value: unknown) => void
  subscribe: (callback: SubscriptionCallback) => void
  reset: () => void
}

export type SubscriptionCallback = (state_handler: StateHandler, me: SubscriptionCallback) => void

export interface ComponentArgs {
  [key: string]: unknown
  state_handler?: StateHandler
  file_loader?: FileLoader
}

export type FileLoader = (path: string, callback: (error: unknown, data: string) => void) => void

export interface ComponentDef {
  component: string
  args?: ComponentArgs
  data?: unknown
}

export interface ComponentConfig {
  validators?: Array<(args: Record<string, unknown>) => void>
  init?: (args: ComponentArgs, selection: D3Selection) => D3Selection | void
  render: (args: ComponentArgs, selection: D3Selection, data: unknown, element: D3Selection, rawData?: unknown) => void
}

export type ComponentFunction = (args: ComponentArgs) => (selection: D3Selection) => (data: unknown) => void
