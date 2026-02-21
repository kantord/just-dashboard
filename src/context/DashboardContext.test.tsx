import { act, renderHook } from '@testing-library/react'
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
        wrapper: ({ children }) => <DashboardProvider>{children}</DashboardProvider>,
      })

      act(() => {
        result.current.setVariable('color', 'blue')
      })

      expect(result.current.variables).toEqual({ color: 'blue' })
    })

    it('initVariable sets variable only if not already set', () => {
      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => <DashboardProvider>{children}</DashboardProvider>,
      })

      act(() => {
        result.current.initVariable('theme', 'dark')
      })

      expect(result.current.variables).toEqual({ theme: 'dark' })

      act(() => {
        result.current.initVariable('theme', 'light')
      })

      expect(result.current.variables).toEqual({ theme: 'dark' })
    })

    it('fileLoader is passed through', () => {
      const mockFileLoader: FileLoader = vi.fn()

      const { result } = renderHook(() => useDashboard(), {
        wrapper: ({ children }) => <DashboardProvider fileLoader={mockFileLoader}>{children}</DashboardProvider>,
      })

      expect(result.current.fileLoader).toBe(mockFileLoader)
    })
  })
})
