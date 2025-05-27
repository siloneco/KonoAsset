import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckboxAndLabel } from './components/CheckboxAndLabel'
import { useResetDialog } from './hook'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  className?: string
}

export const ResetDialog: FC<Props> = ({ className }) => {
  const {
    deleteAppData,
    deleteMetadata,
    deleteAssetData,
    setDeleteAppData,
    setDeleteMetadata,
    setDeleteAssetData,
    executeReset,
    executing,
    confirm,
    setConfirm,
    submitButtonDisabled,
  } = useResetDialog()

  const { t } = useLocalization()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={className}>
          {t('resetdialog:reset')}
        </Button>
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
          <CheckboxAndLabel
            mainText={t('general:appdata')}
            subText={t('general:appdata:subtext')}
            checked={deleteAppData}
            setChecked={setDeleteAppData}
            disabled={executing}
          />
          <CheckboxAndLabel
            mainText={t('general:metadata')}
            subText={t('general:metadata:subtext')}
            checked={deleteMetadata}
            setChecked={setDeleteMetadata}
            disabled={executing}
          />
          <CheckboxAndLabel
            mainText={t('general:assetdata')}
            subText={t('general:assetdata:subtext')}
            checked={deleteAssetData}
            setChecked={setDeleteAssetData}
            disabled={executing}
          />
        </div>
        <Separator />
        <div className="mx-auto">
          <CheckboxAndLabel
            mainText={t('resetdialog:reset-confirm:checkbox-text')}
            checked={confirm}
            setChecked={setConfirm}
            disabled={executing}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-auto" disabled={executing}>
            {t('general:button:cancel')}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={executeReset}
            disabled={submitButtonDisabled}
          >
            {executing && <Loader2 className="animate-spin" />}
            {t('resetdialog:button:delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
