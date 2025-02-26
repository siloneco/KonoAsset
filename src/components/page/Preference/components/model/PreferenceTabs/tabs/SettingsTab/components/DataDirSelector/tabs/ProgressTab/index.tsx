import { DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { FC } from 'react'
import useDataDirSelectorProgressTab from './hook'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  destinationPath: string
  setDialogOpen: (open: boolean) => void
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

const ProgressTab: FC<Props> = ({
  taskId,
  destinationPath,
  setDialogOpen,
  updateLocalDataDir,
}) => {
  const { t } = useLocalization()
  const { percentage, filename, canceling, onCancelButtonClick } =
    useDataDirSelectorProgressTab({
      taskId,
      destinationPath,
      setDialogOpen,
      updateLocalDataDir,
    })

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('preference:settings:progress-bar')}</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
        <p className="text-muted-foreground w-[430px] truncate">{filename}</p>
        <Progress className="mt-1" value={percentage} />
      </div>
      <div className="flex justify-center mt-8">
        <Button
          variant="secondary"
          onClick={onCancelButtonClick}
          disabled={canceling}
        >
          {canceling && <Loader2 className="animate-spin" />}
          {t('general:button:cancel')}
        </Button>
      </div>
    </>
  )
}

export default ProgressTab
