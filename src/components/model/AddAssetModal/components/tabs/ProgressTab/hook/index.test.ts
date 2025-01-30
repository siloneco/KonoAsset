import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { useProgressTab } from '.'
import { commands } from '@/lib/bindings'
import { renderHook } from '@testing-library/react'
import { useToast } from '@/hooks/use-toast'

vi.mock('@/hooks/use-toast', () => {
  const toast = vi.fn()

  return {
    useToast: () => ({
      toast,
    }),
  }
})

vi.mock('@/lib/bindings', () => {
  const cancelTaskRequest = vi
    .fn()
    .mockResolvedValueOnce({
      status: 'ok',
    })
    .mockResolvedValueOnce({
      status: 'error',
      error: 'error message',
    })

  return {
    commands: {
      cancelTaskRequest,
    },
  }
})

describe('ProgressTab Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('it cancels the task on cancel button click', async () => {
    const taskId = 'SampleTaskId'
    const onComplete = vi.fn()
    const onCancelled = vi.fn()

    const { result } = renderHook(() =>
      useProgressTab({
        taskId,
        onCancelled,
        onComplete,
      }),
    )

    // It requests to cancel the task on cancel button click
    await result.current.onCancelButtonClick()

    const mockCancelTaskRequest = commands.cancelTaskRequest as Mock

    expect(mockCancelTaskRequest).toHaveBeenCalledTimes(1)
    expect(mockCancelTaskRequest.mock.calls[0][0]).toBe(taskId)

    // trigger toast on failed to send cancel request
    await result.current.onCancelButtonClick()

    const mockToast = useToast().toast as Mock
    expect(mockToast).toHaveBeenCalledTimes(1)
  })

  it('shows error toast on failed to determine task id', async () => {
    const taskId = null
    const onComplete = vi.fn()
    const onCancelled = vi.fn()

    const { result } = renderHook(() =>
      useProgressTab({
        taskId: taskId,
        onCancelled,
        onComplete,
      }),
    )

    await result.current.onCancelButtonClick()

    const mockToast = useToast().toast as Mock
    expect(mockToast).toHaveBeenCalledTimes(1)
  })
})
