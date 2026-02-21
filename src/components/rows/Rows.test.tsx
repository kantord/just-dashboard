import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Rows } from './Rows'

describe('Rows', () => {
  it('renders ds--rows container', () => {
    const { container } = render(
      <DashboardProvider>
        <Rows data={[]} />
      </DashboardProvider>,
    )

    expect(container.querySelector('.ds--rows')).toBeInTheDocument()
  })

  it('renders children in ds--row divs', () => {
    render(
      <DashboardProvider>
        <Rows
          data={[
            { component: 'text', args: { tagName: 'p' }, data: 'row one' },
            { component: 'text', args: { tagName: 'p' }, data: 'row two' },
          ]}
        />
      </DashboardProvider>,
    )

    expect(screen.getByText('row one')).toBeInTheDocument()
    expect(screen.getByText('row two')).toBeInTheDocument()

    const rows = document.querySelectorAll('.ds--row')
    expect(rows).toHaveLength(2)
  })
})
