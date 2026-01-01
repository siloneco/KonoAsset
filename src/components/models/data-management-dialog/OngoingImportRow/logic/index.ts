import { commands } from '@/lib/bindings'

type CancelTaskResult = 'Completed' | 'Cancelled' | { error: string }

export const requestTaskCancellation = async (
  taskId: string,
): Promise<CancelTaskResult> => {
  const result = await commands.cancelTaskRequest(taskId)

  if (result.status === 'error') {
    return { error: `Failed to cancel task: ${result.error}` }
  }

  const currentStatus = result.data

  if (currentStatus === 'Running') {
    return { error: 'Failed to cancel task' }
  } else if (currentStatus === 'Completed' || currentStatus === 'Cancelled') {
    return currentStatus
  }

  // currentStatus = failed
  const errorResult = await commands.getTaskError(taskId)

  if (errorResult.status === 'error') {
    console.error('Failed to get task error:', errorResult.error)
    return { error: 'Failed to cancel task and get task error' }
  }

  return { error: errorResult.data ?? 'Failed to get task error' }
}
