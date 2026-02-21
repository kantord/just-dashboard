import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { DashboardProvider } from '../../context/DashboardContext'
import { Chart } from './Chart'

describe('Chart', () => {
  it('renders ds--chart container', () => {
    const { container } = render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Chart args={{ type: 'bar' }} data={[]} />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(container.querySelector('.ds--chart')).toBeInTheDocument()
  })

  it('throws when type is missing', () => {
    expect(() =>
      render(
        <NuqsTestingAdapter>
          <DashboardProvider>
            <Chart args={{}} data={[]} />
          </DashboardProvider>
        </NuqsTestingAdapter>,
      ),
    ).toThrow()
  })
})
