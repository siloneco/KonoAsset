import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FC } from 'react'
import { Folder, OctagonAlert, Pencil } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'
import { AssetSummary, Result } from '@/lib/bindings'
import { AssetCardListStyle } from '../../asset-card/AssetCardListStyle'

type Props = {
  tabIndex: {
    current: number
    total: number
  }
  duplicateAssets: AssetSummary[]
  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
  openAssetManagedDir: (assetId: string) => Promise<void>
  openEditAssetDialog: (assetId: string) => Promise<void>
  openDirEditDialog: (assetId: string) => Promise<void>
  nextTab: () => void
  previousTab: () => void
}

export const AssetFormDuplicateWarningTab: FC<Props> = ({
  tabIndex,
  duplicateAssets,
  resolveImageAbsolutePath,
  openAssetManagedDir,
  openEditAssetDialog,
  openDirEditDialog,
  nextTab,
  previousTab,
}) => {
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}){t('addasset:duplicate-warning')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:duplicate-warning:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-6 flex flex-col items-center">
        <p className="flex flex-row">
          <OctagonAlert className="text-destructive mr-2" />
          {t('addasset:duplicate-warning:warning-text')}
        </p>
      </div>
      <div className="space-y-2 w-full grid grid-cols-1">
        {duplicateAssets.map((item) => (
          <AssetCardListStyle
            asset={item}
            resolveImageAbsolutePath={resolveImageAbsolutePath}
          >
            <Button onClick={() => openAssetManagedDir(item.id)}>
              {t('general:button:open')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => openEditAssetDialog(item.id)}
            >
              <Pencil />
            </Button>
            <Button
              variant="secondary"
              onClick={() => openDirEditDialog(item.id)}
            >
              <Folder />
            </Button>
          </AssetCardListStyle>
        ))}
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" className="mr-auto" onClick={previousTab}>
          {t('general:button:back')}
        </Button>
        <Button variant="secondary" className="ml-auto" onClick={nextTab}>
          {t('addasset:duplicate-warning:proceed')}
        </Button>
      </DialogFooter>
    </>
  )
}
