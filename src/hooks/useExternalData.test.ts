import { renderHook, waitFor } from '@testing-library/react'
import type { FileLoader } from '../types'
import { useExternalData } from './useExternalData'

describe('useExternalData', () => {
  it('returns data directly when no loader', () => {
    const { result } = renderHook(() => useExternalData({ key: 'value' }))

    expect(result.current.data).toEqual({ key: 'value' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('calls fileLoader for file data when isFile is true', async () => {
    const mockFileLoader: FileLoader = vi.fn((_path, callback) => {
      callback(null, '{"loaded":true}')
    })

    const { result } = renderHook(() => useExternalData('file://data.json', 'json', mockFileLoader, true))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFileLoader).toHaveBeenCalledWith('file://data.json', expect.any(Function))
    expect(result.current.data).toEqual({ loaded: true })
    expect(result.current.error).toBeNull()
  })

  it('parses CSV data correctly', async () => {
    const csvText = 'name,age\nAlice,30\nBob,25'
    const mockFileLoader: FileLoader = vi.fn((_path, callback) => {
      callback(null, csvText)
    })

    const { result } = renderHook(() => useExternalData('data.csv', 'csv', mockFileLoader, true))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ])
    expect(result.current.error).toBeNull()
  })

  it('returns error on fileLoader error', async () => {
    const mockFileLoader: FileLoader = vi.fn((_path, callback) => {
      callback('File not found', '')
    })

    const { result } = renderHook(() => useExternalData('missing.json', 'json', mockFileLoader, true))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('File not found')
    expect(result.current.data).toBeNull()
  })
})
