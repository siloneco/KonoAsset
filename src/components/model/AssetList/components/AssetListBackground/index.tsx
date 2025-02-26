import { PersistentContext } from '@/components/context/PersistentContext'
import { Button } from '@/components/ui/button'
import { FolderSearch, Sprout } from 'lucide-react'
import { FC, useContext } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  type: 'NoAssets' | 'NoResults'
  openDialog: () => void
}

const AssetListBackground: FC<Props> = ({ type, openDialog }) => {
  const { t } = useLocalization()
  if (type === 'NoAssets') {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-150px)] justify-center items-center">
        <Sprout size={150} className="opacity-40" />
        <p className="text-xl text-foreground/60">
          {t('assetlist:background:no-assets')}
        </p>
        <Button className="mt-4" onClick={openDialog}>
          {t('assetlist:background:add-asset')}
        </Button>
      </div>
    )
  } else if (type === 'NoResults') {
    const { clearFilters } = useContext(PersistentContext)

    return (
      <div className="flex flex-col w-full h-[calc(100vh-150px)] justify-center items-center">
        <FolderSearch size={100} className="opacity-40" />
        <p className="text-xl text-foreground/60">
          {t('assetlist:background:no-results')}
        </p>
        <Button className="mt-4" variant="secondary" onClick={clearFilters}>
          {t('general:clear-filter')}
        </Button>
      </div>
    )
  } else {
    return null
  }
}

export default AssetListBackground
