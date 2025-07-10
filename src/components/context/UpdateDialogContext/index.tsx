import { createContext, ReactNode } from 'react'
import { UpdateDialog } from '@/components/model-legacy/UpdateDialog'
import { useUpdateDialogContext } from './hook'
import { useLocalization } from '@/hooks/use-localization'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type UpdateDialogContextType = {
  checkForUpdate: () => Promise<void>
}

export const UpdateDialogContext = createContext<UpdateDialogContextType>({
  checkForUpdate: async () => {},
})

type Props = {
  children: ReactNode
}

export const UpdateDialogProvider = ({ children }: Props) => {
  const { t } = useLocalization()
  const {
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
    checkForUpdate,
    updateNotificationVisible,
    startUpdateDownloadingAndOpenDialog,
    dismissUpdateNotification,
    isNotificationClosing,
  } = useUpdateDialogContext()

  return (
    <UpdateDialogContext.Provider value={{ checkForUpdate }}>
      {children}

      {(updateNotificationVisible || isNotificationClosing) && (
        <div
          className={cn(
            'fixed bottom-4 right-4 z-50 w-96 bg-background rounded-lg p-4',
            'border-2 border-primary ring-2 ring-primary/60',
            'duration-300 ease-out',
            isNotificationClosing
              ? 'animate-out slide-out-to-bottom-30 fade-out'
              : 'animate-in slide-in-from-bottom-30 fade-in',
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 absolute top-2 right-2"
            onClick={dismissUpdateNotification}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>

          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-sm">
                {t('top:new-update-toast')}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('top:new-update-toast:description')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={dismissUpdateNotification}
              className="w-full"
            >
              {t('top:new-update-toast:close')}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={startUpdateDownloadingAndOpenDialog}
              className="w-full"
            >
              {t('top:new-update-toast:button')}
            </Button>
          </div>
        </div>
      )}

      <UpdateDialog
        dialogOpen={updateDialogOpen}
        setDialogOpen={setUpdateDialogOpen}
        taskId={updateDownloadTaskId}
      />
    </UpdateDialogContext.Provider>
  )
}
