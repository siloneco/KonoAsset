import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { FileInfo } from '@/lib/bindings'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { FC } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { SlimAssetDetail } from '../../model-legacy/SlimAssetDetail'
import { AssetCardOpenButton } from '../../model-legacy/action-buttons/AssetCardOpenButton'
import { useDependencyDialogStore } from '@/stores/dialogs/DependencyDialogStore'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
}

export const DependencyDialog: FC<Props> = ({
  openSelectUnitypackageDialog,
}) => {
  const { isOpen, setOpen, currentAsset } = useDependencyDialogStore()
  const { t } = useLocalization()

  const loading = currentAsset === null

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dependencydialog:header')}</DialogTitle>
          {loading && <Skeleton className="w-52 h-3 rounded-full" />}
          <DialogDescription className="max-w-[450px] truncate">
            {!loading && currentAsset.name}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="w-full h-14 rounded-lg" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-2">
            <div className="space-y-1">
              {currentAsset.dependencies.map((item) => (
                <SlimAssetDetail asset={item} className="max-w-[650px]">
                  <AssetCardOpenButton
                    id={item.id}
                    displayOpenButtonText
                    hasDependencies={item.dependencies.length > 0}
                    openSelectUnitypackageDialog={openSelectUnitypackageDialog}
                  />
                </SlimAssetDetail>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="mx-auto">
              {t('general:button:close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
