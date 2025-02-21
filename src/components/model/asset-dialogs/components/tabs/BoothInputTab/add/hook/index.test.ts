import { describe, expect, it, Mock, vi } from 'vitest'
import { useBoothInputTabForAddDialog } from '.'
import { act, renderHook } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'
import { getAndSetAssetInfoFromBoothToForm } from '../../logic'

vi.mock('../../logic', () => {
  return {
    getAndSetAssetInfoFromBoothToForm: vi
      .fn()
      .mockResolvedValueOnce({
        status: 'ok',
        data: {
          goNext: true,
          duplicated: false,
        },
      })
      .mockResolvedValueOnce({
        status: 'ok',
        data: {
          goNext: false,
          duplicated: true,
          duplicatedItems: [],
        },
      })
      .mockResolvedValueOnce({
        status: 'error',
        error: 'error message',
      }),
  }
})

vi.mock('@/hooks/use-toast', () => {
  const toast = vi.fn()

  return {
    useToast: () => ({
      toast,
    }),
  }
})

describe('BoothInputTab Hook', () => {
  it('executes getAssetDescriptionFromBooth function correctly', async () => {
    const mockForm = {}
    const mockSetTab = vi.fn()
    const mockToast = useToast().toast as Mock

    const { result } = renderHook(() =>
      useBoothInputTabForAddDialog({
        // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
        form: mockForm,
        setTab: mockSetTab,
      }),
    )

    // Nothing happens before the input
    await result.current.getAssetDescriptionFromBooth()
    expect(getAndSetAssetInfoFromBoothToForm).not.toHaveBeenCalled()

    // Success Case
    act(() => {
      result.current.onUrlInputChange({
        // @ts-expect-error type check fails but it satisfies the required fields
        target: { value: 'https://booth.pm/ja/items/12345' },
      })
    })

    await result.current.getAssetDescriptionFromBooth()

    expect(mockSetTab).toHaveBeenCalledTimes(1)
    expect(mockSetTab.mock.calls[0][0]).toEqual('asset-type-selector')

    // Duplication Case
    act(() => {
      result.current.onUrlInputChange({
        // @ts-expect-error type check fails but it satisfies the required fields
        target: { value: 'https://booth.pm/ja/items/12345' },
      })
    })

    await result.current.getAssetDescriptionFromBooth()

    expect(mockSetTab).toHaveBeenCalledTimes(2)
    expect(mockSetTab.mock.calls[1][0]).toEqual('duplicate-warning')

    // Error Case
    act(() => {
      result.current.onUrlInputChange({
        // @ts-expect-error type check fails but it satisfies the required fields
        target: { value: 'https://booth.pm/ja/items/12345' },
      })
    })

    await result.current.getAssetDescriptionFromBooth()

    expect(mockToast).toHaveBeenCalledOnce()
  })

  it('executes backToPreviousTab function correctly', async () => {
    const mockForm = {}
    const mockSetTab = vi.fn()

    const { result } = renderHook(() =>
      useBoothInputTabForAddDialog({
        // @ts-expect-error mockForm is not a valid AssetFormType but satisfies the required fields
        form: mockForm,
        setTab: mockSetTab,
      }),
    )

    result.current.backToPreviousTab()

    expect(mockSetTab).toHaveBeenCalledTimes(1)
    expect(mockSetTab.mock.calls[0][0]).toEqual('selector')
  })
})
