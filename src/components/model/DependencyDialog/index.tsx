import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { FC, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLocalization } from '@/hooks/use-localization'
import { Result } from '@/lib/bindings'
import { AssetCardListStyle } from '@/components/presentation/asset-card/AssetCardListStyle'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'

type Props = {
  assetId: string | null
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const DependencyDialog: FC<Props> = ({
  assetId,
  dialogOpen,
  setDialogOpen,
  resolveImageAbsolutePath,
}) => {
  const { t } = useLocalization()
  const { sortedAssetSummaries } = useAssetSummaryStore()

  const assetName = useMemo(() => {
    return sortedAssetSummaries.find((asset) => asset.id === assetId)?.name
  }, [sortedAssetSummaries, assetId])

  const dependencies = useMemo(() => {
    const dependencyIds = sortedAssetSummaries.find(
      (asset) => asset.id === assetId,
    )?.dependencies

    if (!dependencyIds) return []

    return sortedAssetSummaries.filter((asset) =>
      dependencyIds.includes(asset.id),
    )
  }, [sortedAssetSummaries, assetId])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('dependencydialog:header')}</DialogTitle>
          <DialogDescription className="max-w-[450px] truncate">
            {assetName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-2">
          <div className="space-y-1">
            {dependencies.map((item) => (
              <AssetCardListStyle
                asset={item}
                resolveImageAbsolutePath={resolveImageAbsolutePath}
              />
            ))}
          </div>
        </ScrollArea>
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
