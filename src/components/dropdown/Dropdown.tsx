import { useEffect } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useExternalData } from '../../hooks/useExternalData'
import { useQuery } from '../../hooks/useQuery'
import { format_value } from '../../interpolation'
import type { ComponentProps } from '../../types'
import { regexp, required } from '../../validators'
import { ErrorMessage } from '../ErrorMessage'
import { Spinner } from '../Spinner'

interface DropdownItem {
  value: string
  text: string
}

const validators = [
  required('variable'),
  regexp('variable', /^[A-Za-z]([_A-Za-z0-9-]*[_A-Za-z0-9])?$/),
  required('default'),
]

export function Dropdown({ args = {}, data }: ComponentProps) {
  const { variables, fileLoader, setVariable, initVariable } = useDashboard()
  const formatted = format_value({ ...args }, variables) as Record<string, unknown>

  for (const v of validators) v(formatted)

  const variableName = formatted.variable as string
  const defaultValue = formatted.default as string

  const formattedData = format_value(data, variables)
  const {
    data: loaded,
    loading,
    error,
  } = useExternalData(formattedData, formatted.loader as string | undefined, fileLoader, !!formatted.is_file)
  const { data: queried, loading: qLoading, error: qError } = useQuery(loaded, formatted.query as string | undefined)

  const items = (queried as DropdownItem[] | null) ?? []
  const currentValue = variables[variableName]

  useEffect(() => {
    initVariable(variableName, defaultValue)
  }, [variableName, defaultValue, initVariable])

  useEffect(() => {
    if (items.length === 0) return
    if (currentValue === '~first') {
      setVariable(variableName, items[0].value)
    } else if (currentValue === '~last') {
      setVariable(variableName, items[items.length - 1].value)
    }
  }, [currentValue, items, variableName, setVariable])

  if (loading || qLoading) return <Spinner />
  if (error || qError) return <ErrorMessage message={(error || qError)!} />

  return (
    <select
      className="ds--select"
      value={(currentValue as string) ?? ''}
      onChange={(e) => setVariable(variableName, e.target.value)}
    >
      {items.map((item) => (
        <option key={item.value} className="ds--select-option" value={item.value}>
          {item.text}
        </option>
      ))}
    </select>
  )
}
