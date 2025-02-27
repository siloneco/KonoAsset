import { useToast } from '@/hooks/use-toast'
import { commands, events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  onCompleted: () => void
  onCancelled: () => void
  onFailed: (error: string | null) => void
}

type ReturnProps = {
  percentage: number
  filename: string
  canceling: boolean
  onCancelButtonClick: () => Promise<void>
}

export const useProgressTab = ({
  taskId,
  onCompleted,
  onCancelled,
  onFailed,
}: Props): ReturnProps => {
  const { t } = useLocalization()

  const [canceling, setCanceling] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [filename, setFilename] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    let isCancelled = false
    let callbackExecuted = false
    let unlistenProgressFn: UnlistenFn | undefined = undefined
    let unlistenCompleteFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenCompleteFn = await events.taskStatusChanged.listen((e) => {
          if (isCancelled) return

          const completedTaskId = e.payload.id
          const status = e.payload.status

          if (
            callbackExecuted ||
            completedTaskId !== taskId ||
            status === 'Running'
          ) {
            return
          }

          callbackExecuted = true
          if (status == 'Completed') {
            onCompleted()
          } else if (status === 'Cancelled') {
            onCancelled()
          } else if (status === 'Failed') {
            commands.getTaskError(taskId).then((result) => {
              if (result.status === 'ok') {
                onFailed(result.data)
              } else {
                console.error('Failed to get task error:', result.error)
              }
            })
          }
        })

        if (isCancelled) {
          unlistenCompleteFn()
          return
        }

        unlistenProgressFn = await events.progressEvent.listen((e) => {
          if (isCancelled) return

          setPercentage(e.payload.percentage)
          setFilename(e.payload.filename)
        })

        if (isCancelled) {
          unlistenProgressFn()
          unlistenCompleteFn()
          return
        }

        if (taskId === null || callbackExecuted) {
          return
        }

        const result = await commands.getTaskStatus(taskId)

        if (result.status === 'error') {
          console.error('Failed to get task status:', result.error)
          return
        }

        if (result.data === 'Completed') {
          onCompleted()
        } else if (result.data === 'Cancelled') {
          onCancelled()
        } else if (result.data === 'Failed') {
          const errorResult = await commands.getTaskError(taskId)

          if (errorResult.status === 'ok') {
            onFailed(errorResult.data)
          } else {
            console.error('Failed to get task error:', errorResult.error)
          }
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
      unlistenProgressFn?.()
      unlistenCompleteFn?.()
    }
  }, [taskId, onCompleted, onFailed, onCancelled])

  const onCancelButtonClick = async () => {
    try {
      setCanceling(true)

      if (taskId === null) {
        toast({
          title: t('general:error'),
          description: t('addasset:progress-bar:error-toast:task-id-is-null'),
        })
        return
      }

      const result = await commands.cancelTaskRequest(taskId)

      if (result.status === 'error') {
        console.error('Failed to cancel task:', result.error)

        toast({
          title: t('general:error'),
          description: t(
            'addasset:progress-bar:error-toast:task-cancel-description',
          ),
        })
        return
      }
    } finally {
      // It takes a few moments to cancel the task, so delay activation of the button
      setTimeout(() => {
        setCanceling(false)
      }, 10000)
    }
  }

  return {
    percentage,
    filename,
    canceling,
    onCancelButtonClick,
  }
}
