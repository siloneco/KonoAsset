import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { FC, useContext, useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { AssetContext } from '@/components/context/AssetContext'
import { SlimAssetDetail } from '../SlimAssetDetail'
import { useLocalization } from '@/hooks/use-localization'
import { AssetCardOpenButton } from '../action-buttons/AssetCardOpenButton'

type Props = {
  assetName: string | null
  dependencyIds: string[]
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
  openDependencyDialog: (assetName: string, dependencies: string[]) => void
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
}

export const DependencyDialog: FC<Props> = ({
  assetName,
  dependencyIds,
  dialogOpen,
  setDialogOpen,
  openDependencyDialog,
  openSelectUnitypackageDialog,
}) => {
  const [dependencies, setDependencies] = useState<AssetSummary[]>([])
  const [loading, setLoading] = useState(false)

  const { t } = useLocalization()
  const { assetDisplaySortedList } = useContext(AssetContext)

  const updateDependencies = () => {
    setLoading(true)
    try {
      setDependencies(
        assetDisplaySortedList.filter((asset) =>
          dependencyIds.includes(asset.id),
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      updateDependencies()
    }
  }, [dialogOpen, dependencyIds])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dependencydialog:header')}</DialogTitle>
          {loading && <Skeleton className="w-52 h-3 rounded-full" />}
          <DialogDescription className="max-w-[450px] truncate">
            {!loading && assetName}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="w-full h-14 rounded-lg" />
            <Skeleton className="w-full h-14 rounded-lg" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-2">
            <div className="space-y-1">
              {dependencies.map((item) => (
                <SlimAssetDetail asset={item} className="max-w-[650px]">
                  <AssetCardOpenButton
                    id={item.id}
                    displayOpenButtonText
                    hasDependencies={item.dependencies.length > 0}
                    openDependencyDialog={() =>
                      openDependencyDialog(item.name, item.dependencies)
                    }
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
