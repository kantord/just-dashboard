import { useDashboard } from '../../context/DashboardContext'
import { useExternalData } from '../../hooks/useExternalData'
import { useQuery } from '../../hooks/useQuery'
import { format_value } from '../../interpolation'
import type { ComponentProps } from '../../types'
import { regexp, required } from '../../validators'
import { ErrorMessage } from '../ErrorMessage'
import { Spinner } from '../Spinner'

const validators = [required('tagName'), regexp('tagName', /^[A-Za-z]([A-Za-z0-9-]*[A-Za-z0-9])?$/)]

export function Text({ args = {}, data }: ComponentProps) {
  const { variables, fileLoader } = useDashboard()
  const formatted = format_value({ ...args }, variables) as Record<string, unknown>

  for (const v of validators) v(formatted)

  const formattedData = format_value(data, variables)
  const {
    data: loaded,
    loading,
    error,
  } = useExternalData(formattedData, formatted.loader as string | undefined, fileLoader, !!formatted.is_file)
  const { data: queried, loading: qLoading, error: qError } = useQuery(loaded, formatted.query as string | undefined)

  if (loading || qLoading) return <Spinner />
  if (error || qError) return <ErrorMessage message={(error || qError)!} />

  const Tag = formatted.tagName as keyof React.JSX.IntrinsicElements
  const alignProps = formatted.align ? { 'data-align': formatted.align as string } : {}

  return (
    <Tag className="ds--text" {...alignProps}>
      {queried as string}
    </Tag>
  )
}
