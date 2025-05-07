import { downloadUpdate } from '@/components/page/Top/logic'
import { checkForUpdate, dismissUpdate } from '@/components/page/Top/logic'
import { buttonVariants } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import { useLocalization } from '@/hooks/use-localization'
import { useState } from 'react'

type ReturnProps = {
  updateDialogOpen: boolean
  setUpdateDialogOpen: (open: boolean) => void
  updateDownloadTaskId: string | null
  checkForUpdate: () => Promise<void>
}

export const useUpdateDialogContext = (): ReturnProps => {
  const { toast } = useToast()
  const { t } = useLocalization()
  const [updateDownloadTaskId, setUpdateDownloadTaskId] = useState<
    string | null
  >(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)

  const startUpdateDownloadingAndOpenDialog = async () => {
    await downloadUpdate(setUpdateDownloadTaskId)
    setUpdateDialogOpen(true)
  }

  const executeUpdateCheck = async () => {
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
  }

  return {
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
    checkForUpdate: executeUpdateCheck,
  }
}
