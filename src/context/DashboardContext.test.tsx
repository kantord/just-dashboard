import { act, renderHook } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import type { FileLoader } from '../types'
import { DashboardProvider, useDashboard } from './DashboardContext'

describe('DashboardContext', () => {
  describe('useDashboard', () => {
    it('throws when used outside provider', () => {
      expect(() => {
        renderHook(() => useDashboard())
      }).toThrow('useDashboard must be used within a DashboardProvider')
    })

    it('setVariable updates variables', () => {
      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => (
          <NuqsTestingAdapter>
            <DashboardProvider variableDefs={[{ name: 'color', defaultValue: '' }]}>{children}</DashboardProvider>
          </NuqsTestingAdapter>
        ),
      })

      act(() => {
        result.current.setVariable('color', 'blue')
      })

      expect(result.current.variables.color).toBe('blue')
    })

    it('provides default values from variableDefs', () => {
      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => (
          <NuqsTestingAdapter>
            <DashboardProvider variableDefs={[{ name: 'theme', defaultValue: 'dark' }]}>{children}</DashboardProvider>
          </NuqsTestingAdapter>
        ),
      })

      expect(result.current.variables.theme).toBe('dark')
    })

    it('initVariable is a no-op', () => {
      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => (
          <NuqsTestingAdapter>
            <DashboardProvider variableDefs={[{ name: 'theme', defaultValue: 'dark' }]}>{children}</DashboardProvider>
          </NuqsTestingAdapter>
        ),
      })

      act(() => {
        result.current.initVariable('theme', 'light')
      })

      expect(result.current.variables.theme).toBe('dark')
    })

    it('fileLoader is passed through', () => {
      const mockFileLoader: FileLoader = vi.fn()

      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => (
          <NuqsTestingAdapter>
            <DashboardProvider fileLoader={mockFileLoader}>{children}</DashboardProvider>
          </NuqsTestingAdapter>
        ),
      })

      expect(result.current.fileLoader).toBe(mockFileLoader)
    })
  })
})
