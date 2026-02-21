import { useEffect, useState } from 'react'
import emuto from '../jq-web'

export function useQuery(data: unknown, query?: string): { data: unknown; loading: boolean; error: string | null } {
  const [result, setResult] = useState<unknown>(query ? null : data)
  const [loading, setLoading] = useState(!!query && data != null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) {
      setResult(data)
      setLoading(false)
      return
    }

    if (data == null) return

    setLoading(true)
    setError(null)

    emuto(data, query)
      .then((res) => {
        setResult(res)
        setLoading(false)
      })
      .catch((e) => {
        setError(String(e))
        setLoading(false)
      })
  }, [data, query])

  return { data: result, loading, error }
}
