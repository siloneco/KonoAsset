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
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { useUpdateDialog } from './hook'

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  taskId: string | null
}

export const UpdateDialog: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  taskId,
}) => {
  const { t } = useLocalization()

  const { progress, onCancelButtonClick, onUpdateButtonClick } =
    useUpdateDialog({
      setDialogOpen,
      taskId,
    })

  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        className="max-w-[600px] [&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>アップデートを準備中</DialogTitle>
          <DialogDescription>
            アップデートをダウンロードしています...
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 w-full overflow-hidden">
          <p className="text-muted-foreground">
            {progress >= 100 && <span>アップデートをダウンロード済み</span>}
            {progress < 100 && <span>"ダウンロード中 ({progress}%)"</span>}
          </p>
          <Progress value={progress} />
        </div>
        <DialogFooter className="mt-4">
          <div className="w-full max-w-72 flex justify-between mx-auto">
            <Button
              variant="secondary"
              className="mr-auto"
              onClick={onCancelButtonClick}
            >
              {t('general:button:cancel')}
            </Button>
            <div className="relative">
              <Button
                className="ml-auto"
                disabled={progress < 100}
                onClick={onUpdateButtonClick}
              >
                アップデート
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
