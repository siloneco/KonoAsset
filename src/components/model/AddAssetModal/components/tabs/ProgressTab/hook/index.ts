import { useToast } from '@/hooks/use-toast'
import { commands, events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'

type Props = {
  taskId: string | null
  onComplete: () => void
  onCancelled: () => void
}

type ReturnProps = {
  progress: number
  filename: string
  canceling: boolean
  onCancelButtonClick: () => Promise<void>
}

export const useProgressTab = ({
  taskId,
  onComplete,
  onCancelled,
}: Props): ReturnProps => {
  const [canceling, setCanceling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filename, setFilename] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    let isCancelled = false
    let onCompletedOrCancelledExecuted = false
    let unlistenProgressFn: UnlistenFn | undefined = undefined
    let unlistenCompleteFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenCompleteFn = await events.taskStatusChanged.listen((e) => {
          if (isCancelled) return

          const completedTaskId = e.payload.id
          const status = e.payload.status

          console.log(status)

          if (
            onCompletedOrCancelledExecuted ||
            completedTaskId !== taskId ||
            status === 'Running'
          ) {
            return
          }

          onCompletedOrCancelledExecuted = true
          if (status == 'Completed') {
            onComplete()
          } else if (status === 'Cancelled') {
            onCancelled()
          }
        })

        if (isCancelled) {
          unlistenCompleteFn()
          return
        }

        unlistenProgressFn = await events.importProgress.listen((e) => {
          if (isCancelled) return

          setProgress(e.payload.percentage)
          setFilename(e.payload.filename)
        })

        if (isCancelled) {
          unlistenProgressFn()
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

        if (result.data === 'Completed') {
          onComplete()
        } else if (result.data === 'Cancelled') {
          onCancelled()
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
  }, [taskId, onComplete, onCancelled])

  const onCancelButtonClick = async () => {
    try {
      setCanceling(true)

      if (taskId === null) {
        toast({
          title: 'エラー',
          description: 'タスク ID が見つかりませんでした。',
        })
        return
      }

      const result = await commands.cancelTaskRequest(taskId)

      if (result.status === 'error') {
        console.error('Failed to cancel task:', result.error)

        toast({
          title: 'エラー',
          description: 'タスクのキャンセルに失敗しました。',
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
    progress,
    filename,
    canceling,
    onCancelButtonClick,
  }
}
