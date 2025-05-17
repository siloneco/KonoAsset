import { useToast } from '@/hooks/use-toast'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  destinationPath: string
  setDialogOpen: (open: boolean) => void
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

type ReturnProps = {
  onCompleted: () => Promise<void>
  onCancelled: () => Promise<void>
  onFailed: (error: string | null) => Promise<void>
}

export const useDataDirSelectorProgressTab = ({
  destinationPath,
  setDialogOpen,
  updateLocalDataDir,
}: Props): ReturnProps => {
  const { t } = useLocalization()
  const { toast } = useToast()

  const onCompleted = async () => {
    await updateLocalDataDir(destinationPath)

    setDialogOpen(false)
    toast({
      title: t('preference:settings:progress-bar:success-toast'),
    })
  }

  const onCancelled = async () => {
    setDialogOpen(false)
    toast({
      title: t('general:cancelled'),
    })
  }

  const onFailed = async (error: string | null) => {
    setDialogOpen(false)
    toast({
      title: t('general:toast-error-description'),
      description: error,
    })
  }

  return {
    onCompleted,
    onCancelled,
    onFailed,
  }
}
