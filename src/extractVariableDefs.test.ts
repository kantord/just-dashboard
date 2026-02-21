import { extractVariableDefs } from './extractVariableDefs'
import type { ComponentDef } from './types'

describe('extractVariableDefs', () => {
  it('returns empty array for non-dropdown component', () => {
    const def: ComponentDef = { component: 'text', args: { tagName: 'p' }, data: 'hello' }
    expect(extractVariableDefs(def)).toEqual([])
  })

  it('extracts a single dropdown variable', () => {
    const def: ComponentDef = {
      component: 'dropdown',
      args: { variable: 'color', default: 'red' },
      data: [],
    }
    expect(extractVariableDefs(def)).toEqual([{ name: 'color', defaultValue: 'red' }])
  })

  it('extracts dropdown variables nested in data arrays', () => {
    const def: ComponentDef = {
      component: 'root',
      args: { title: 'Test' },
      data: [
        { component: 'text', args: { tagName: 'p' }, data: 'hello' },
        { component: 'dropdown', args: { variable: 'theme', default: 'dark' }, data: [] },
      ],
    }
    expect(extractVariableDefs(def)).toEqual([{ name: 'theme', defaultValue: 'dark' }])
  })

  it('deduplicates by name, keeping the first occurrence', () => {
    const def: ComponentDef = {
      component: 'root',
      args: { title: 'Test' },
      data: [
        { component: 'dropdown', args: { variable: 'x', default: 'first' }, data: [] },
        { component: 'dropdown', args: { variable: 'x', default: 'second' }, data: [] },
      ],
    }
    expect(extractVariableDefs(def)).toEqual([{ name: 'x', defaultValue: 'first' }])
  })

  it('extracts multiple distinct variables', () => {
    const def: ComponentDef = {
      component: 'root',
      args: { title: 'Test' },
      data: [
        { component: 'dropdown', args: { variable: 'a', default: '1' }, data: [] },
        { component: 'dropdown', args: { variable: 'b', default: '2' }, data: [] },
      ],
    }
    expect(extractVariableDefs(def)).toEqual([
      { name: 'a', defaultValue: '1' },
      { name: 'b', defaultValue: '2' },
    ])
  })

  it('defaults to empty string when default is missing', () => {
    const def: ComponentDef = {
      component: 'dropdown',
      args: { variable: 'color' },
      data: [],
    }
    expect(extractVariableDefs(def)).toEqual([{ name: 'color', defaultValue: '' }])
  })

  it('handles deeply nested structures', () => {
    const def: ComponentDef = {
      component: 'root',
      args: { title: 'Test' },
      data: [
        {
          component: 'columns',
          args: {},
          data: [
            {
              component: 'rows',
              data: [{ component: 'dropdown', args: { variable: 'deep', default: 'val' }, data: [] }],
            },
          ],
        },
      ],
    }
    expect(extractVariableDefs(def)).toEqual([{ name: 'deep', defaultValue: 'val' }])
  })
})
