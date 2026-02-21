import type { ComponentDef } from './types'

export interface VariableDef {
  name: string
  defaultValue: string
}

export function extractVariableDefs(def: ComponentDef): VariableDef[] {
  const seen = new Set<string>()
  const result: VariableDef[] = []

  function walk(node: unknown): void {
    if (!node || typeof node !== 'object') return

    if (Array.isArray(node)) {
      for (const item of node) walk(item)
      return
    }

    const record = node as Record<string, unknown>

    if (record.component === 'dropdown' && record.args) {
      const args = record.args as Record<string, unknown>
      const name = typeof args.variable === 'string' ? args.variable : undefined
      const defaultValue = typeof args.default === 'string' ? args.default : ''
      if (name && !seen.has(name)) {
        seen.add(name)
        result.push({ name, defaultValue })
      }
    }

    if (record.data != null) walk(record.data)
  }

  walk(def)
  return result
}
