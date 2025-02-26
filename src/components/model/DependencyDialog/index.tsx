import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { AssetSummary } from '@/lib/bindings'
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
import SlimAssetDetail from '../SlimAssetDetail'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  assetName: string | null
  dependencyIds: string[]
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
}

export const DependencyDialog: FC<Props> = ({
  assetName,
  dependencyIds,
  dialogOpen,
  setDialogOpen,
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
            <Skeleton className="w-40 h-4 rounded-full" />
            <Skeleton className="w-64 h-4 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-96 h-4 rounded-full" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-2">
            <div className="space-y-1">
              {dependencies.map((item) => (
                <SlimAssetDetail asset={item} className="max-w-[450px]" />
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
