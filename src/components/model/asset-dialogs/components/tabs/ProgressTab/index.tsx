import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { truncateFilename } from './logic'
import { useProgressTab } from './hook'
import { Loader2 } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  onCompleted: () => void
  onCancelled: () => void
  onFailed: (error: string | null) => void
}

const ProgressTab = ({ taskId, onCompleted, onFailed, onCancelled }: Props) => {
  const { t } = useLocalization()
  const { percentage, filename, canceling, onCancelButtonClick } =
    useProgressTab({
      taskId,
      onCompleted,
      onCancelled,
      onFailed,
    })

  return (
    <>
      <DialogHeader>
        <DialogTitle> {t('addasset:progress-bar')} </DialogTitle>
      </DialogHeader>
      <div className="my-8 space-y-2">
        <p className="max-w-[600px] truncate">
          <span className="text-muted-foreground text-ellipsis">
            {truncateFilename(filename)}
          </span>
        </p>
        <Progress value={percentage} />
      </div>
      <DialogFooter className="mt-8">
        <Button
          variant="secondary"
          className="mx-auto"
          onClick={onCancelButtonClick}
          disabled={canceling}
        >
          {canceling && <Loader2 className="animate-spin" />}
          {canceling
            ? t('addasset:progress-bar:canceling')
            : t('general:button:cancel')}
        </Button>
      </DialogFooter>
    </>
  )
}

export default ProgressTab
