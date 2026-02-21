import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { DashboardProvider } from '../../context/DashboardContext'
import { Root } from './Root'

describe('Root', () => {
  it('sets document.title', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Root args={{ title: 'My Dashboard' }} data={[]} />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(document.title).toBe('My Dashboard')
  })

  it('renders children in ds--wrapper divs', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Root
            args={{ title: 'Test' }}
            data={[
              { component: 'text', args: { tagName: 'p' }, data: 'child one' },
              { component: 'text', args: { tagName: 'p' }, data: 'child two' },
            ]}
          />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('child one')).toBeInTheDocument()
    expect(screen.getByText('child two')).toBeInTheDocument()

    const wrappers = document.querySelectorAll('.ds--wrapper')
    expect(wrappers).toHaveLength(2)
  })

  it('throws when title is missing', () => {
    expect(() =>
      render(
        <NuqsTestingAdapter>
          <DashboardProvider>
            <Root args={{}} data={[]} />
          </DashboardProvider>
        </NuqsTestingAdapter>,
      ),
    ).toThrow()
  })
})
