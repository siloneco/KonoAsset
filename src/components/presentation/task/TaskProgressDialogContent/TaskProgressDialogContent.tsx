import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { useTaskProgressDialogContent } from './hook'

type Props = {
  title: string
  description: string
  message: string
  progress: number
  cancel: () => Promise<void>
}

export const TaskProgressDialogContent: FC<Props> = ({
  title,
  description,
  message,
  progress,
  cancel,
}) => {
  const { t } = useLocalization()
  const { onCancelButtonClick, canceling } = useTaskProgressDialogContent({
    cancel,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-1 w-full overflow-hidden">
        <div className="w-full">
          <p className="text-muted-foreground truncate h-6">{message}</p>
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
}
