import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { events, commands, LocalizedChanges } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  taskId: string | null
}

type ReturnProps = {
  progress: number
  localizedChanges: LocalizedChanges[] | null
  onCancelButtonClick: () => Promise<void>
  onUpdateButtonClick: () => Promise<void>
}

export const useUpdateDialog = ({
  dialogOpen,
  setDialogOpen,
  taskId,
}: Props): ReturnProps => {
  const [progress, setProgress] = useState(0)
  const [localizedChanges, setLocalizedChanges] = useState<
    LocalizedChanges[] | null
  >(null)

  const { toast } = useToast()
  const { t } = useLocalization()

  const onCancelButtonClick = async () => {
    if (taskId !== null) {
      const result = await commands.cancelTaskRequest(taskId)
      if (result.status === 'error') {
        console.error('Failed to cancel task:', result.error)
      }
    }

    setDialogOpen(false)
    toast({
      title: t('general:cancelled'),
    })
  }

  const onUpdateButtonClick = async () => {
    const result = await commands.installUpdate()

    if (result.status === 'error') {
      console.error('Failed to install update:', result.error)
    }
  }

  const getLocalizedChanges = async () => {
    const result = await commands.getChangelog()

    if (result.status === 'error') {
      console.error('Failed to get localized changes:', result.error)
      setLocalizedChanges([])
      return
    }

    setLocalizedChanges(result.data)
  }

  useEffect(() => {
    if (dialogOpen === true) {
      getLocalizedChanges()
    }
  }, [dialogOpen])

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
          if (status === 'Completed') {
            setProgress(100)
          } else if (status === 'Cancelled') {
            onCancelButtonClick()
          } else if (status === 'Failed') {
            commands.getTaskError(taskId).then((result) => {
              if (result.status === 'ok') {
                toast({
                  title: t('general:failed'),
                  description: result.data,
                })
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

        unlistenProgressFn = await events.updateProgress.listen((e) => {
          if (isCancelled) return

          setProgress(e.payload.progress * 100)
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
          setProgress(100)
        } else if (result.data === 'Cancelled') {
          onCancelButtonClick()
        } else if (result.data === 'Failed') {
          const result = await commands.getTaskError(taskId)

          if (result.status === 'ok') {
            toast({
              title: t('general:failed'),
              description: result.data,
            })
          } else {
            console.error('Failed to get task error:', result.error)
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
  }, [taskId])

  return {
    progress,
    localizedChanges,
    onCancelButtonClick,
    onUpdateButtonClick,
  }
}
