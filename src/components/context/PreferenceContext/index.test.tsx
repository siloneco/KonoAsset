import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { PreferenceContextProvider } from '.'
import { useTheme } from 'next-themes'
import { usePreferenceContext } from './hook'

vi.mock('./hook', () => {
  return {
    usePreferenceContext: vi.fn().mockReturnValue({
      preferenceContextValue: {
        preference: {
          theme: 'system',
        },
      },
    }),
  }
})

vi.mock('next-themes', () => {
  const setTheme = vi.fn()

  return {
    useTheme: () => ({
      setTheme,
    }),
  }
})

describe('PreferenceContext', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders children correctly', async () => {
    const childrenText = 'children'

    render(
      <PreferenceContextProvider>
        <div>{childrenText}</div>
      </PreferenceContextProvider>,
    )

    // Check if the children is rendered
    screen.getByText(childrenText)
  })

  it('calls usePreferenceContext and apply theme', async () => {
    render(
      <PreferenceContextProvider>
        <div />
      </PreferenceContextProvider>,
    )

    // usePreferenceContext should be called
    const mockUsePreferenceContext = usePreferenceContext as Mock
    expect(mockUsePreferenceContext).toHaveBeenCalledOnce()

    // Check if the theme is set
    const mockSetTheme = useTheme().setTheme as Mock
    expect(mockSetTheme).toHaveBeenCalledOnce()
    expect(mockSetTheme.mock.calls[0][0]).toBe('system')
  })
})
