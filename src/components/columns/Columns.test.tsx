import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Columns } from './Columns'

describe('Columns', () => {
  it('renders ds--columns container', () => {
    const { container } = render(
      <DashboardProvider>
        <Columns args={{}} data={[]} />
      </DashboardProvider>,
    )

    expect(container.querySelector('.ds--columns')).toBeInTheDocument()
  })

  it('renders children in ds--column divs', () => {
    render(
      <DashboardProvider>
        <Columns
          args={{}}
          data={[
            { component: 'text', args: { tagName: 'p' }, data: 'col one' },
            { component: 'text', args: { tagName: 'p' }, data: 'col two' },
          ]}
        />
      </DashboardProvider>,
    )

    expect(screen.getByText('col one')).toBeInTheDocument()
    expect(screen.getByText('col two')).toBeInTheDocument()

    const columns = document.querySelectorAll('.ds--column')
    expect(columns).toHaveLength(2)
  })

  it('uses default column count of 2', () => {
    const { container } = render(
      <DashboardProvider>
        <Columns args={{}} data={[]} />
      </DashboardProvider>,
    )

    const columnsEl = container.querySelector('.ds--columns')
    expect(columnsEl).toHaveAttribute('data-ds--columns', '2')
  })
})
