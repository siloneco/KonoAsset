import { afterEach, describe, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider } from '.'
import { solveMatchMediaIssue } from '@/test/init'

solveMatchMediaIssue()

describe('ThemeProvider', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders children correctly', async () => {
    const childrenText = 'children'

    render(
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div>{childrenText}</div>
      </ThemeProvider>,
    )

    // Check if the children is rendered
    screen.getByText(childrenText)
  })
})
