import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { Loader2 } from 'lucide-react'
import { FC, ReactNode } from 'react'
import { useAssetCardDeleteDialog } from './hook'

type Props = {
  children: ReactNode
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  deleteAsset: () => Promise<void>
}

export const AssetCardDeleteDialog: FC<Props> = ({
  children,
  dialogOpen,
  setDialogOpen,
  deleteAsset,
}) => {
  const { t } = useLocalization()
  const { deleteInProgress, onDeleteButtonClicked } = useAssetCardDeleteDialog({
    setDialogOpen,
    deleteAsset,
  })

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('assetcard:more-button:delete-confirm')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('assetcard:more-button:delete-confirm:explanation-text-1')}
          </AlertDialogDescription>
          <AlertDialogDescription className="font-bold">
            {t('assetcard:more-button:delete-confirm:explanation-text-2')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteInProgress}>
            {t('general:button:cancel')}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="transition-none transition-colors"
            disabled={deleteInProgress}
            onClick={onDeleteButtonClicked}
          >
            {deleteInProgress && <Loader2 className="animate-spin" />}
            {t('general:button:delete')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
