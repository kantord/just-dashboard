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
  const { variables, fileLoader, setVariable } = useDashboard()
  const formatted = format_value({ ...args }, variables)

  for (const v of validators) v(formatted)

  const variableName = typeof formatted.variable === 'string' ? formatted.variable : ''

  const formattedData = format_value(data, variables)
  const {
    data: loaded,
    loading,
    error,
  } = useExternalData(
    formattedData,
    typeof formatted.loader === 'string' ? formatted.loader : undefined,
    fileLoader,
    !!formatted.is_file,
  )
  const {
    data: queried,
    loading: qLoading,
    error: qError,
  } = useQuery(loaded, typeof formatted.query === 'string' ? formatted.query : undefined)

  const items = (queried as DropdownItem[] | null) ?? []
  const currentValue = variables[variableName]

  useEffect(() => {
    if (items.length === 0) return
    if (currentValue === '~first') {
      setVariable(variableName, items[0].value)
    } else if (currentValue === '~last') {
      setVariable(variableName, items[items.length - 1].value)
    }
  }, [currentValue, items, variableName, setVariable])

  if (loading || qLoading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  if (qError) return <ErrorMessage message={qError} />

  return (
    <select
      className="ds--select"
      value={typeof currentValue === 'string' ? currentValue : ''}
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
