import * as Plot from '@observablehq/plot'
import { useEffect, useRef } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { useExternalData } from '../../hooks/useExternalData'
import { useQuery } from '../../hooks/useQuery'
import { format_value } from '../../interpolation'
import type { ComponentProps } from '../../types'
import { required } from '../../validators'
import { ErrorMessage } from '../ErrorMessage'
import { Spinner } from '../Spinner'

const validators = [required('type')]

function createMark(type: string, data: Record<string, unknown>[], stacked: boolean, rotated: boolean) {
  const markOptions: Record<string, unknown> = rotated ? { y: 'x', x: 'y' } : { x: 'x', y: 'y' }
  if (stacked) Object.assign(markOptions, Plot.stackY())

  switch (type) {
    case 'bar':
      return rotated ? Plot.barX(data, markOptions) : Plot.barY(data, markOptions)
    case 'line':
      return Plot.lineY(data, markOptions)
    case 'spline':
      return Plot.lineY(data, { ...markOptions, curve: 'catmull-rom' })
    case 'area':
      return Plot.areaY(data, markOptions)
    case 'step':
      return Plot.lineY(data, { ...markOptions, curve: 'step' })
    case 'scatter':
      return Plot.dot(data, markOptions)
    case 'bubble':
      return Plot.dot(data, { ...markOptions, r: 'r' })
    default:
      return Plot.barY(data, markOptions)
  }
}

export function Chart({ args = {}, data }: ComponentProps) {
  const ref = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!ref.current || queried == null) return
    ref.current.innerHTML = ''
    const plotData = (Array.isArray(queried) ? queried : []) as Record<string, unknown>[]
    const axisConfig =
      typeof formatted.axis === 'object' && formatted.axis !== null ? (formatted.axis as Record<string, unknown>) : null
    const rotated = !!axisConfig?.rotated
    const chartType = typeof formatted.type === 'string' ? formatted.type : 'bar'
    const mark = createMark(chartType, plotData, !!formatted.stacked, rotated)
    const plotOptions: Record<string, unknown> = { marks: [mark] }
    if (axisConfig) {
      if (axisConfig.x) plotOptions.x = axisConfig.x
      if (axisConfig.y) plotOptions.y = axisConfig.y
    }
    ref.current.appendChild(Plot.plot(plotOptions))
  }, [queried, formatted.type, formatted.stacked, formatted.axis])

  if (loading || qLoading) return <Spinner />
  if (error) return <ErrorMessage message={error} />
  if (qError) return <ErrorMessage message={qError} />

  return <div ref={ref} className="ds--chart" />
}
