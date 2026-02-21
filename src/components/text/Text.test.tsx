import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { DashboardProvider } from '../../context/DashboardContext'
import { Text } from './Text'

describe('Text', () => {
  it('renders text in the correct tag', () => {
    const { unmount } = render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Text args={{ tagName: 'h1' }} data="Hello World" />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('Hello World').tagName).toBe('H1')
    unmount()

    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Text args={{ tagName: 'p' }} data="Paragraph text" />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('Paragraph text').tagName).toBe('P')
  })

  it('renders with ds--text class', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Text args={{ tagName: 'p' }} data="styled text" />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('styled text')).toHaveClass('ds--text')
  })

  it('throws when tagName is missing', () => {
    expect(() =>
      render(
        <NuqsTestingAdapter>
          <DashboardProvider>
            <Text args={{}} data="no tag" />
          </DashboardProvider>
        </NuqsTestingAdapter>,
      ),
    ).toThrow()
  })

  it('renders with data-align when align arg is provided', () => {
    render(
      <NuqsTestingAdapter>
        <DashboardProvider>
          <Text args={{ tagName: 'p', align: 'center' }} data="aligned text" />
        </DashboardProvider>
      </NuqsTestingAdapter>,
    )

    expect(screen.getByText('aligned text')).toHaveAttribute('data-align', 'center')
  })
})
