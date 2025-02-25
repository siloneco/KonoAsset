import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { commands, events, TaskStatus } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { UnlistenFn } from '@tauri-apps/api/event'
import { Ban, Check, Loader2 } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string
  filename: string
  markAsFinished: () => void
}

const OngoingImportRow: FC<Props> = ({ taskId, filename, markAsFinished }) => {
  const [status, setStatus] = useState<TaskStatus>('Running')
  const { t } = useLocalization()
  const { toast } = useToast()

  const cancelTask = async () => {
    const result = await commands.cancelTaskRequest(taskId)

    if (result.status === 'ok') {
      const currentStatus = result.data

      if (currentStatus === 'Running') {
        return
      }

      setStatus(currentStatus)
      markAsFinished()

      if (currentStatus === 'Failed') {
        const errorResult = await commands.getTaskError(taskId)

        if (errorResult.status === 'error') {
          console.error('Failed to get task error:', errorResult.error)
          return
        }

        toast({
          title: t('assetcard:more-button:fail-import-toast'),
          description: errorResult.data ?? t('general:toast-error-description'),
        })
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
          setStatus(status)
          markAsFinished()

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
        markAsFinished()

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
  }, [taskId])

  return (
    <div className="flex flex-row items-center space-x-2">
      {status === 'Running' && (
        <Loader2 size={24} className="animate-spin text-foreground/60" />
      )}
      {(status === 'Cancelled' || status === 'Failed') && (
        <Ban size={20} className="text-red-400" />
      )}
      {status === 'Completed' && <Check size={24} className="text-green-600" />}
      <p className="w-96 truncate">
        {status === 'Cancelled' && (
          <span className="text-foreground/60 mr-2">
            ({t('general:cancelled')})
          </span>
        )}
        {status === 'Failed' && (
          <span className="text-foreground/60 mr-2">
            ({t('general:failed')})
          </span>
        )}
        <span
          className={cn(
            (status === 'Cancelled' || status === 'Failed') && 'line-through',
          )}
        >
          {filename}
        </span>
      </p>
      {status === 'Running' && (
        <Button variant="destructive" className="w-8 h-8" onClick={cancelTask}>
          <Ban />
        </Button>
      )}
    </div>
  )
}

export default OngoingImportRow
