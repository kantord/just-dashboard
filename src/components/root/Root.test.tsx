import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Root } from './Root'

describe('Root', () => {
  it('sets document.title', () => {
    render(
      <DashboardProvider>
        <Root args={{ title: 'My Dashboard' }} data={[]} />
      </DashboardProvider>,
    )

    expect(document.title).toBe('My Dashboard')
  })

  it('renders children in ds--wrapper divs', () => {
    render(
      <DashboardProvider>
        <Root
          args={{ title: 'Test' }}
          data={[
            { component: 'text', args: { tagName: 'p' }, data: 'child one' },
            { component: 'text', args: { tagName: 'p' }, data: 'child two' },
          ]}
        />
      </DashboardProvider>,
    )

    expect(screen.getByText('child one')).toBeInTheDocument()
    expect(screen.getByText('child two')).toBeInTheDocument()

    const wrappers = document.querySelectorAll('.ds--wrapper')
    expect(wrappers).toHaveLength(2)
  })

  it('throws when title is missing', () => {
    expect(() =>
      render(
        <DashboardProvider>
          <Root args={{}} data={[]} />
        </DashboardProvider>,
      ),
    ).toThrow()
  })
})
