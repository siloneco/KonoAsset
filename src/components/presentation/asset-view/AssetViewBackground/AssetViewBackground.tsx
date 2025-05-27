import { Button } from '@/components/ui/button'
import { FolderSearch, Sprout } from 'lucide-react'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  type: 'NoAssets' | 'NoResults'
  openAddAssetDialog: () => void
  clearAssetFilters: () => void
}

export const AssetViewBackground: FC<Props> = ({
  type,
  openAddAssetDialog,
  clearAssetFilters,
}) => {
  const { t } = useLocalization()

  if (type === 'NoAssets') {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <Sprout size={150} className="opacity-40" />
        <p className="text-xl text-muted-foreground">
          {t('assetview:background:no-assets')}
        </p>
        <Button className="mt-4" onClick={openAddAssetDialog}>
          {t('assetview:background:add-asset')}
        </Button>
      </div>
    )
  } else if (type === 'NoResults') {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <FolderSearch size={125} className="opacity-40" />
        <p className="text-xl text-muted-foreground">
          {t('assetview:background:no-results')}
        </p>
        <Button
          className="mt-2"
          variant="secondary"
          onClick={clearAssetFilters}
        >
          {t('general:clear-filter')}
        </Button>
      </div>
    )
  }
}
