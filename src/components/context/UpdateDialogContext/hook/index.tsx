import { buttonVariants } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import { useLocalization } from '@/hooks/use-localization'
import { useCallback, useContext, useState } from 'react'
import { checkForUpdate, dismissUpdate, downloadUpdate } from '../logic'
import { PreferenceContext } from '../../PreferenceContext'

type ReturnProps = {
  updateDialogOpen: boolean
  setUpdateDialogOpen: (open: boolean) => void
  updateDownloadTaskId: string | null
  checkForUpdate: () => Promise<void>
}

export const useUpdateDialogContext = (): ReturnProps => {
  const { toast } = useToast()
  const { t } = useLocalization()
  const { loaded } = useContext(PreferenceContext)

  const [updateDownloadTaskId, setUpdateDownloadTaskId] = useState<
    string | null
  >(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  const startUpdateDownloadingAndOpenDialog = useCallback(async () => {
    await downloadUpdate(setUpdateDownloadTaskId)
    setUpdateDialogOpen(true)
  }, [setUpdateDownloadTaskId, setUpdateDialogOpen])

  const executeUpdateCheck = useCallback(async () => {
    if (!loaded) {
      return
    }

    const updateAvailable = await checkForUpdate()

    if (!updateAvailable) {
      return
    }

    toast({
      title: t('top:new-update-toast'),
      description: t('top:new-update-toast:description'),
      duration: 30000,
      onSwipeEnd: () => {
        dismissUpdate()
      },
      action: (
        <div className="flex flex-col space-y-2">
          <ToastAction
            altText="Open update dialog"
            className={buttonVariants({ variant: 'default' })}
            onClick={startUpdateDownloadingAndOpenDialog}
          >
            {t('top:new-update-toast:button')}
          </ToastAction>
          <ToastAction
            altText="Ignore update"
            className={buttonVariants({ variant: 'outline' })}
            onClick={() => dismissUpdate()}
          >
            {t('top:new-update-toast:close')}
          </ToastAction>
        </div>
      ),
    })
  }, [t, toast, startUpdateDownloadingAndOpenDialog, loaded])

  return {
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
    checkForUpdate: executeUpdateCheck,
  }
}
