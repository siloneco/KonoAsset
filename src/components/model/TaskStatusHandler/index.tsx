import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import { useTaskStatusHandler } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  title: string
  description: string
  onCompleted: () => Promise<void>
  onCancelled: () => Promise<void>
  onFailed: (error: string | null) => Promise<void>
  noDialogWrap?: boolean
}

export const TaskStatusHandler: FC<Props> = ({
  taskId,
  title,
  description,
  onCompleted,
  onCancelled,
  onFailed,
  noDialogWrap = false,
}) => {
  const { t } = useLocalization()

  const { dialogOpen, progress, filename, onCancelButtonClick, canceling } =
    useTaskStatusHandler({
      taskId,
      onCompleted,
      onCancelled,
      onFailed,
    })

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-1 w-full overflow-hidden">
        <div className="w-full">
          <p className="text-muted-foreground truncate h-6">{filename}</p>
        </div>
        <Progress value={progress} />
      </div>
      <DialogFooter className="mt-4">
        <Button
          variant="secondary"
          className="mx-auto"
          onClick={onCancelButtonClick}
          disabled={canceling}
        >
          {canceling && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {t('general:button:cancel')}
        </Button>
      </DialogFooter>
    </>
  )

  if (noDialogWrap) {
    return dialogOpen ? content : null
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        className="max-w-[600px] [&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        {content}
      </DialogContent>
    </Dialog>
  )
}
