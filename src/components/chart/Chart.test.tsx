import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Chart } from './Chart'

describe('Chart', () => {
  it('renders ds--chart container', () => {
    const { container } = render(
      <DashboardProvider>
        <Chart args={{ type: 'bar' }} data={[]} />
      </DashboardProvider>,
    )

    expect(container.querySelector('.ds--chart')).toBeInTheDocument()
  })

  it('throws when type is missing', () => {
    expect(() =>
      render(
        <DashboardProvider>
          <Chart args={{}} data={[]} />
        </DashboardProvider>,
      ),
    ).toThrow()
  })
})
