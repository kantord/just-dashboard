import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { DashboardProvider } from '../../context/DashboardContext'
import { Board } from './Board'

describe('Board', () => {
  it('renders ds--board container', () => {
    const { container } = render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Board data={[]} />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(container.querySelector('.ds--board')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Board
            data={[
              { component: 'text', args: { tagName: 'p' }, data: 'board child one' },
              { component: 'text', args: { tagName: 'p' }, data: 'board child two' },
            ]}
          />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('board child one')).toBeInTheDocument()
    expect(screen.getByText('board child two')).toBeInTheDocument()
  })
})
