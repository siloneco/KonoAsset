import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { PersistentContextProvider } from '.'
import { usePersistentContext } from './hook'

vi.mock('./hook', () => {
  return {
    usePersistentContext: vi
      .fn()
      .mockReturnValue({ persistentContextValue: {} }),
  }
})

describe('PersistentContext', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders children correctly', async () => {
    const childrenText = 'children'

    render(
      <PersistentContextProvider>
        <div>{childrenText}</div>
      </PersistentContextProvider>,
    )

    // Check if the children is rendered
    screen.getByText(childrenText)
  })

  it('calls hook correctly', async () => {
    render(
      <PersistentContextProvider>
        <div />
      </PersistentContextProvider>,
    )

    // usePreferenceContext should be called
    const mockUsePersistentContext = usePersistentContext as Mock
    expect(mockUsePersistentContext).toHaveBeenCalledOnce()
  })
})
