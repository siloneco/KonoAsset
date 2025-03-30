import { afterEach, describe, expect, it, Mock, vi } from 'vitest'
import { usePreferenceContext } from '.'
import { commands, PreferenceStore } from '@/lib/bindings'

import { renderHook, waitFor } from '@testing-library/react'
import { getPreferences } from '../logic'

const mockPreference: PreferenceStore = {
  dataDirPath: '/path/to/data/dir',
  theme: 'system',
  useUnitypackageSelectedOpen: true,
  deleteOnImport: true,
  updateChannel: 'Stable',
  language: 'en-US',
}

vi.mock('../logic', () => {
  return {
    getPreferences: vi.fn().mockImplementation(async () => {
      return mockPreference
    }),
  }
})

vi.mock('@/lib/bindings', () => {
  return {
    commands: {
      setPreferences: vi
        .fn()
        .mockResolvedValueOnce({ status: 'ok', data: null })
        .mockResolvedValueOnce({ status: 'error', error: 'error' }),
    },
  }
})

describe('PreferenceContext Hook', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('executes usePreferenceContext function correctly', async () => {
    const mockGetPreferences = getPreferences as Mock
    const mockSetPreferences = commands.setPreferences as Mock

    const { result } = renderHook(() => usePreferenceContext())

    // Wait for the useEffect to finish
    await waitFor(() => expect(mockGetPreferences).toHaveBeenCalledOnce())

    expect(result.current.preferenceContextValue.preference).toEqual(
      mockPreference,
    )

    // Do not call setPreferences if save is false
    const newValueWithoutSave = {
      ...mockPreference,
      dataDirPath: '/new/path/123',
    }

    await result.current.preferenceContextValue.setPreference(
      newValueWithoutSave,
      false,
    )

    expect(mockSetPreferences).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(result.current.preferenceContextValue.preference).toEqual(
        newValueWithoutSave,
      ),
    )

    // Call setPreferences if save is true
    const newValueWithSave = { ...mockPreference, dataDirPath: '/new/path/456' }
    await result.current.preferenceContextValue.setPreference(
      newValueWithSave,
      true,
    )

    expect(mockSetPreferences).toHaveBeenCalledTimes(1)
    expect(mockSetPreferences.mock.calls[0][0]).toEqual(newValueWithSave)

    await waitFor(() =>
      expect(result.current.preferenceContextValue.preference).toEqual(
        newValueWithSave,
      ),
    )

    // Failed to save preferences
    const newValueWithSaveButFailed = {
      ...mockPreference,
      dataDirPath: '/new/path/789',
    }
    await result.current.preferenceContextValue.setPreference(
      newValueWithSaveButFailed,
      true,
    )

    expect(mockSetPreferences).toHaveBeenCalledTimes(2)
    expect(mockSetPreferences.mock.calls[1][0]).toEqual(
      newValueWithSaveButFailed,
    )

    expect(result.current.preferenceContextValue.preference).not.toEqual(
      newValueWithSaveButFailed,
    )
  })
})
