import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../context/DashboardContext'
import { DashboardRenderer } from './DashboardRenderer'

describe('DashboardRenderer', () => {
  it('renders unknown component error for unrecognized component type', () => {
    render(
      <DashboardProvider>
        <DashboardRenderer definition={{ component: 'nonexistent' }} />
      </DashboardProvider>,
    )

    expect(screen.getByText('Unknown component: nonexistent')).toBeInTheDocument()
    expect(screen.getByText('Unknown component: nonexistent')).toHaveClass('error')
  })

  it('renders a text component correctly', () => {
    render(
      <DashboardProvider>
        <DashboardRenderer definition={{ component: 'text', args: { tagName: 'p' }, data: 'hello' }} />
      </DashboardProvider>,
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('hello').tagName).toBe('P')
    expect(screen.getByText('hello')).toHaveClass('ds--text')
  })
})
