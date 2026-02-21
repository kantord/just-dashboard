import { renderHook, waitFor } from '@testing-library/react'
import emuto from '../jq-web'
import { useQuery } from './useQuery'

vi.mock('../jq-web', () => ({
  default: vi.fn(),
}))

const mockedEmuto = emuto as ReturnType<typeof vi.fn>

describe('useQuery', () => {
  beforeEach(() => {
    mockedEmuto.mockReset()
  })

  it('returns data directly when no query', () => {
    const { result } = renderHook(() => useQuery({ foo: 'bar' }))

    expect(result.current.data).toEqual({ foo: 'bar' })
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('runs emuto query and returns result', async () => {
    mockedEmuto.mockResolvedValue('filtered')

    const { result } = renderHook(() => useQuery([1, 2, 3], '.'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockedEmuto).toHaveBeenCalledWith([1, 2, 3], '.')
    expect(result.current.data).toBe('filtered')
    expect(result.current.error).toBeNull()
  })

  it('returns null data while loading', () => {
    mockedEmuto.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useQuery({ key: 'value' }, '.key'))

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('returns error on query failure', async () => {
    mockedEmuto.mockRejectedValue(new Error('bad query'))

    const { result } = renderHook(() => useQuery({ a: 1 }, 'invalid!!!'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Error: bad query')
    expect(result.current.data).toBeNull()
  })
})
