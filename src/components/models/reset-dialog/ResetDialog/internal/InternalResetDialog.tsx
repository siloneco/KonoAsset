import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { ResetDialogCheckbox } from '../../ResetDialogCheckbox'
import { useInternalResetDialog } from './hook'

type Props = {
  deleteInProgress: boolean

  deleteAppData: boolean
  deleteMetadata: boolean
  deleteAssetData: boolean

  setDeleteAppData: (deleteAppData: boolean) => void
  setDeleteMetadata: (deleteMetadata: boolean) => void
  setDeleteAssetData: (deleteAssetData: boolean) => void

  confirm: boolean
  setConfirm: (confirm: boolean) => void

  executeReset: () => Promise<void>
}

export const InternalResetDialog: FC<Props> = ({
  deleteInProgress,
  deleteAppData,
  deleteMetadata,
  deleteAssetData,
  setDeleteAppData,
  setDeleteMetadata,
  setDeleteAssetData,
  confirm,
  setConfirm,
  executeReset,
}) => {
  const { t } = useLocalization()

  const { dialogOpen, setDialogOpen, submitButtonDisabled } =
    useInternalResetDialog({
      deleteAppData,
      deleteMetadata,
      deleteAssetData,
      confirm,
      deleteInProgress,
      setDeleteAppData,
      setDeleteMetadata,
      setDeleteAssetData,
      setConfirm,
    })

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t('resetdialog:reset')}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('resetdialog:reset-confirm')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('resetdialog:reset-confirm:explanation-text-1')}
            <br />
            {t('resetdialog:reset-confirm:explanation-text-2')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label className="text-base">
            {t('resetdialog:reset:select-items')}
          </Label>
          <div className="space-y-2 ml-4">
            <ResetDialogCheckbox
              checked={deleteAppData}
              setChecked={setDeleteAppData}
              disabled={deleteInProgress}
            >
              {t('general:appdata')}
              <span className="ml-2 text-muted-foreground">
                ({t('general:appdata:subtext')})
              </span>
            </ResetDialogCheckbox>
            <ResetDialogCheckbox
              checked={deleteMetadata}
              setChecked={setDeleteMetadata}
              disabled={deleteInProgress}
            >
              {t('general:metadata')}
              <span className="ml-2 text-muted-foreground">
                ({t('general:metadata:subtext')})
              </span>
            </ResetDialogCheckbox>
            <ResetDialogCheckbox
              checked={deleteAssetData}
              setChecked={setDeleteAssetData}
              disabled={deleteInProgress}
            >
              {t('general:assetdata')}
              <span className="ml-2 text-muted-foreground">
                ({t('general:assetdata:subtext')})
              </span>
            </ResetDialogCheckbox>
          </div>
        </div>
        <Separator />
        <div className="mx-auto">
          <ResetDialogCheckbox
            checked={confirm}
            setChecked={setConfirm}
            disabled={deleteInProgress}
          >
            {t('resetdialog:reset-confirm:checkbox-text')}
          </ResetDialogCheckbox>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-auto" disabled={deleteInProgress}>
            {t('general:button:cancel')}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={executeReset}
            disabled={submitButtonDisabled}
          >
            {deleteInProgress && <Loader2 className="animate-spin" />}
            {t('resetdialog:button:delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
