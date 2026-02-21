import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DashboardProvider } from '../../context/DashboardContext'
import { Text } from './Text'

describe('Text', () => {
  it('renders text in the correct tag', () => {
    const { unmount } = render(
      <DashboardProvider>
        <Text args={{ tagName: 'h1' }} data="Hello World" />
      </DashboardProvider>,
    )

    expect(screen.getByText('Hello World').tagName).toBe('H1')
    unmount()

    render(
      <DashboardProvider>
        <Text args={{ tagName: 'p' }} data="Paragraph text" />
      </DashboardProvider>,
    )

    expect(screen.getByText('Paragraph text').tagName).toBe('P')
  })

  it('renders with ds--text class', () => {
    render(
      <DashboardProvider>
        <Text args={{ tagName: 'p' }} data="styled text" />
      </DashboardProvider>,
    )

    expect(screen.getByText('styled text')).toHaveClass('ds--text')
  })

  it('throws when tagName is missing', () => {
    expect(() =>
      render(
        <DashboardProvider>
          <Text args={{}} data="no tag" />
        </DashboardProvider>,
      ),
    ).toThrow()
  })

  it('renders with data-align when align arg is provided', () => {
    render(
      <DashboardProvider>
        <Text args={{ tagName: 'p', align: 'center' }} data="aligned text" />
      </DashboardProvider>,
    )

    expect(screen.getByText('aligned text')).toHaveAttribute('data-align', 'center')
  })
})
