import { useEffect, useState } from 'react'
import type { FileLoader } from '../types'

type LoaderName = 'csv' | 'json' | 'tsv' | 'text'

const LOADER_NAMES = new Set<string>(['csv', 'json', 'tsv', 'text'])

function isLoaderName(value: string): value is LoaderName {
  return LOADER_NAMES.has(value)
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })
}

function parseTsv(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  if (lines.length === 0) return []
  const headers = lines[0].split('\t').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split('\t').map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] ?? ''
    })
    return row
  })
}

function parseData(text: string, loader: LoaderName): unknown {
  switch (loader) {
    case 'csv':
      return parseCsv(text)
    case 'tsv':
      return parseTsv(text)
    case 'json':
      return JSON.parse(text)
    case 'text':
      return text
  }
}

export function useExternalData(
  data: unknown,
  loader?: string,
  fileLoader?: FileLoader,
  isFile?: boolean,
): { data: unknown; loading: boolean; error: string | null } {
  const [loadedData, setLoadedData] = useState<unknown>(loader ? null : data)
  const [loading, setLoading] = useState(!!loader)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loader) {
      setLoadedData(data)
      setLoading(false)
      return
    }

    const source = typeof data === 'string' ? data : String(data)
    setLoading(true)
    setError(null)

    if (isFile && fileLoader) {
      fileLoader(source, (err, rawText) => {
        if (err) {
          setError(String(err))
          setLoading(false)
          return
        }
        try {
          setLoadedData(parseData(rawText, isLoaderName(loader) ? loader : 'text'))
        } catch (e) {
          setError(String(e))
        }
        setLoading(false)
      })
    } else {
      fetch(source)
        .then((res) => res.text())
        .then((text) => {
          setLoadedData(parseData(text, isLoaderName(loader) ? loader : 'text'))
          setLoading(false)
        })
        .catch((e) => {
          setError(String(e))
          setLoading(false)
        })
    }
  }, [data, loader, fileLoader, isFile])

  return { data: loadedData, loading, error }
}
