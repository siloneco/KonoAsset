import { events, commands } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect } from 'react'

type Props = {
  taskId: string | null
  onCompleted: () => void
  onCancelled: () => void
  onFailed: (error: string | null) => void
}

export const useTaskStatus = ({
  taskId,
  onCompleted,
  onCancelled,
  onFailed,
}: Props) => {
  useEffect(() => {
    if (taskId === null) {
      return
    }

    let isCancelled = false
    let onCompletedOrCancelledExecuted = false
    let unlistenEvent: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenEvent = await events.taskStatusChanged.listen((e) => {
          if (isCancelled) return

          const completedTaskId = e.payload.id
          const status = e.payload.status

          if (
            onCompletedOrCancelledExecuted ||
            completedTaskId !== taskId ||
            status === 'Running'
          ) {
            return
          }

          onCompletedOrCancelledExecuted = true

          if (status === 'Completed') {
            onCompleted()
          } else if (status === 'Cancelled') {
            onCancelled()
          } else if (status === 'Failed') {
            commands.getTaskError(taskId).then((result) => {
              if (result.status === 'ok') {
                onFailed(result.data)
              }
            })
          }
        })

        if (isCancelled || onCompletedOrCancelledExecuted) {
          unlistenEvent()
          return
        }

        const result = await commands.getTaskStatus(taskId)

        if (result.status === 'error') {
          console.error('Failed to get task status:', result.error)
          return
        }

        const currentStatus = result.data
        if (currentStatus === 'Running') {
          return
        }

        if (currentStatus === 'Completed') {
          onCompleted()
        } else if (currentStatus === 'Cancelled') {
          onCancelled()
        } else if (currentStatus === 'Failed') {
          commands.getTaskError(taskId).then((result) => {
            if (result.status === 'ok') {
              onFailed(result.data)
            }
          })
        }
      } catch (error) {
        console.error(
          'Failed to listen to TaskCompleted and TaskStatusChanged event:',
          error,
        )
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenEvent?.()
    }
  }, [taskId, onCompleted, onCancelled, onFailed])
}
