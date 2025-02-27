import { useToast } from '@/hooks/use-toast'
import { commands, events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  destinationPath: string
  setDialogOpen: (open: boolean) => void
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

type ReturnProps = {
  percentage: number
  filename: string

  canceling: boolean
  onCancelButtonClick: () => Promise<void>
}

const useDataDirSelectorProgressTab = ({
  taskId,
  destinationPath,
  setDialogOpen,
  updateLocalDataDir,
}: Props): ReturnProps => {
  const [percentage, setPercentage] = useState(0)
  const [filename, setFilename] = useState('')
  const [canceling, setCanceling] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  const onCompleted = async () => {
    await updateLocalDataDir(destinationPath)

    setDialogOpen(false)
    toast({
      title: t('preference:settings:progress-bar:success-toast'),
    })
  }

  const onCancelled = () => {
    setCanceling(false)
    setDialogOpen(false)
    toast({
      title: t('general:cancelled'),
    })
  }

  const onFailed = (error: string | null) => {
    setDialogOpen(false)
    toast({
      title: t('general:toast-error-description'),
      description: error,
    })
  }

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
          'Failed to listen to TaskCompleted event and ProgressEvent:',
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
  }, [taskId])

  const onCancelButtonClick = async () => {
    if (taskId === null) {
      return
    }

    setCanceling(true)
    setTimeout(() => {
      setCanceling(false)
    }, 5000)

    const result = await commands.cancelTaskRequest(taskId)

    if (result.status === 'error') {
      console.error('Failed to cancel task:', result.error)
      toast({
        title: 'エラー',
        description: 'タスクのキャンセルに失敗しました',
      })
      return
    }
  }

  return { percentage, filename, canceling, onCancelButtonClick }
}

export default useDataDirSelectorProgressTab
