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
  const formatted = format_value({ ...args }, variables)

  for (const v of validators) v(formatted)

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

  if (loading || qLoading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  if (qError) return <ErrorMessage message={qError} />

  const Tag = (typeof formatted.tagName === 'string' ? formatted.tagName : 'div') as keyof React.JSX.IntrinsicElements
  const alignProps = typeof formatted.align === 'string' ? { 'data-align': formatted.align } : {}

  return (
    <Tag className="ds--text" {...alignProps}>
      {String(queried)}
    </Tag>
  )
}
