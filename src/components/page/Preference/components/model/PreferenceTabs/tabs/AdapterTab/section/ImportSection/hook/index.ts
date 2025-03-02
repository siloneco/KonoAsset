import { useToast } from '@/hooks/use-toast'
import { commands, events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { open } from '@tauri-apps/plugin-dialog'
import { useEffect, useState } from 'react'

type ReturnProps = {
  dialogOpen: boolean
  startImport: () => Promise<void>
  progress: number
  filename: string
  onCancelButtonClick: () => Promise<void>
  canceling: boolean
}

export const useImportSection = (): ReturnProps => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [filename, setFilename] = useState('')
  const [canceling, setCanceling] = useState(false)

  const { toast } = useToast()

  const startImport = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    })

    if (dir === null) {
      return
    }

    const result = await commands.importFromOtherDataStore(dir)

    if (result.status === 'error') {
      toast({
        title: 'インポートに失敗しました',
        description: result.error,
      })
      return
    }

    setDialogOpen(true)
    setTaskId(result.data)
  }

  const onCompleted = () => {
    setDialogOpen(false)
    toast({
      title: 'インポートが完了しました！',
    })
  }

  const onCancelled = () => {
    setDialogOpen(false)
    toast({
      title: 'インポートがキャンセルされました',
    })
  }

  const onFailed = (error: string | null) => {
    setDialogOpen(false)
    toast({
      title: 'インポートに失敗しました',
      description: error,
    })
  }

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
      toast({
        title: 'キャンセルに失敗しました',
        description: result.error,
      })
    }
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

          setProgress(e.payload.percentage)
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
  }, [taskId])

  return {
    dialogOpen,
    startImport,
    progress,
    filename,
    onCancelButtonClick,
    canceling,
  }
}
