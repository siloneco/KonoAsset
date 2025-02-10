import { Button } from '@/components/ui/button'
import { commands, events } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { UnlistenFn } from '@tauri-apps/api/event'
import { Ban, Check, Loader2 } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

type Props = {
  taskId: string
  filename: string
  onCancelled: () => void
  markAsFinished: () => void
}

const OngoingImportRow: FC<Props> = ({
  taskId,
  filename,
  onCancelled,
  markAsFinished,
}) => {
  const [completed, setCompleted] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const cancelTask = async () => {
    const result = await commands.cancelTaskRequest(taskId)

    if (result.status === 'ok') {
      if (result.data === 'Cancelled') {
        setCancelled(true)
        markAsFinished()
      } else if (result.data === 'Completed') {
        setCompleted(true)
        markAsFinished()
      }
    }
  }

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
          if (status == 'Completed') {
            setCompleted(true)
            markAsFinished()
          } else if (status === 'Cancelled') {
            onCancelled()
          }
        })

        if (isCancelled) {
          unlistenCompleteFn()
          return
        }

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

        if (result.data === 'Completed') {
          setCompleted(true)
          markAsFinished()
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
      unlistenCompleteFn?.()
    }
  }, [taskId])

  return (
    <div className="flex flex-row items-center space-x-2">
      {!completed && !cancelled && (
        <Loader2 size={24} className="animate-spin text-foreground/60" />
      )}
      {!completed && cancelled && <Ban size={20} className="text-red-400" />}
      {completed && <Check size={24} className="text-green-600" />}
      <p className="w-96 truncate">
        {cancelled && (
          <span className="text-foreground/60 mr-2">
            (キャンセルされました)
          </span>
        )}
        <span className={cn(cancelled && 'line-through')}>{filename}</span>
      </p>
      {!completed && !cancelled && (
        <Button variant="destructive" className="w-8 h-8" onClick={cancelTask}>
          <Ban />
        </Button>
      )}
    </div>
  )
}

export default OngoingImportRow
