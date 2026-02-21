import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Dropdown } from './Dropdown'

vi.mock('../../hooks/useExternalData', () => ({
  useExternalData: (data: unknown) => ({ data, loading: false, error: null }),
}))

vi.mock('../../hooks/useQuery', () => ({
  useQuery: (data: unknown) => ({ data, loading: false, error: null }),
}))

describe('Dropdown', () => {
  it('renders a select element with options', () => {
    const options = [
      { value: 'a', text: 'Option A' },
      { value: 'b', text: 'Option B' },
    ]

    render(
      <DashboardProvider>
        <Dropdown args={{ variable: 'color', default: 'a' }} data={options} />
      </DashboardProvider>,
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('throws when variable arg is missing', () => {
    expect(() =>
      render(
        <DashboardProvider>
          <Dropdown args={{ default: 'a' }} data={[]} />
        </DashboardProvider>,
      ),
    ).toThrow()
  })
})
