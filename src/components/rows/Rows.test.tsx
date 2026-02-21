import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { DashboardProvider } from '../../context/DashboardContext'
import { Rows } from './Rows'

describe('Rows', () => {
  it('renders ds--rows container', () => {
    const { container } = render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Rows data={[]} />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(container.querySelector('.ds--rows')).toBeInTheDocument()
  })

  it('renders children in ds--row divs', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Rows
            data={[
              { component: 'text', args: { tagName: 'p' }, data: 'row one' },
              { component: 'text', args: { tagName: 'p' }, data: 'row two' },
            ]}
          />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('row one')).toBeInTheDocument()
    expect(screen.getByText('row two')).toBeInTheDocument()

    const rows = document.querySelectorAll('.ds--row')
    expect(rows).toHaveLength(2)
  })
})
