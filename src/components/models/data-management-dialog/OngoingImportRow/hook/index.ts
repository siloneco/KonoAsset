import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { commands, events, TaskStatus } from '@/lib/bindings'
import { useDataManagementDialogStore } from '@/stores/dialogs/DataManagementDialogStore'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useState, useEffect, useCallback } from 'react'
import { requestTaskCancellation } from '../logic'

type Props = {
  taskId: string
}

type ReturnProps = {
  status: TaskStatus
  onCancelButtonClick: () => Promise<void>
}

export const useOngoingImportRow = ({ taskId }: Props): ReturnProps => {
  const [status, setStatus] = useState<TaskStatus>('Running')
  const { t } = useLocalization()
  const { toast } = useToast()

  const { onTaskCompleted } = useDataManagementDialogStore()

  const cancelTask = useCallback(async () => {
    const result = await requestTaskCancellation(taskId)

    if (result === 'Completed' || result === 'Cancelled') {
      setStatus(result)
      onTaskCompleted(taskId)
      return
    }

    const error = result.error

    toast({
      title: t('assetcard:more-button:fail-import-toast'),
      description: error,
    })
  }, [onTaskCompleted, t, taskId, toast])

  useEffect(() => {
    let isCancelled = false
    let onCompletedOrCancelledExecuted = false
    let unlistenCompleteFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenCompleteFn = await events.taskStatusChanged.listen((e) => {
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
          setStatus(status)
          onTaskCompleted(taskId)

          if (status === 'Failed') {
            commands.getTaskError(taskId).then((result) => {
              if (result.status === 'ok') {
                toast({
                  title: t('assetcard:more-button:fail-import-toast'),
                  description:
                    result.data ?? t('general:toast-error-description'),
                })
              }
            })
          }
        })

        if (isCancelled) {
          unlistenCompleteFn()
          return
        }

        if (taskId === null || onCompletedOrCancelledExecuted) {
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

        setStatus(currentStatus)
        onTaskCompleted(taskId)

        if (currentStatus === 'Failed') {
          const errorResult = await commands.getTaskError(taskId)

          if (errorResult.status === 'error') {
            console.error('Failed to get task error:', errorResult.error)
            return
          }

          toast({
            title: t('assetcard:more-button:fail-import-toast'),
            description:
              errorResult.data ?? t('general:toast-error-description'),
          })
        }
      } catch (error) {
        console.error(
          'Failed to listen to TaskCompleted and ImportProgress event:',
          error,
        )
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenCompleteFn?.()
    }
  }, [taskId, onTaskCompleted, t, toast])

  return {
    status,
    onCancelButtonClick: cancelTask,
  }
}
