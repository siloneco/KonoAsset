import { PersistentContext } from '@/components/context/PersistentContext'
import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'
import { useContext } from 'react'

import { AssetContext } from '@/components/context/AssetContext'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { LayoutPopover } from './components/LayoutPopover'

type Props = {
  className?: string
  displayAssetCount?: number
}

const NavBar = ({ className, displayAssetCount }: Props) => {
  const { clearFilters } = useContext(PersistentContext)
  const { assetDisplaySortedList } = useContext(AssetContext)

  const { t } = useLocalization()
  const totalAssetCount = assetDisplaySortedList.length
  const showingCount = displayAssetCount ?? totalAssetCount

  return (
    <div className={cn('p-4', className)}>
      <div className="flex flex-row w-full">
        <div className="w-full">
          <Card className="min-h-10 flex items-center">
            <div className="lg:w-28" />
            <div className="my-auto ml-4 lg:mx-auto">
              <span className="text-muted-foreground">
                {t('mainnavbar:total-asset-count:foretext')}
                {totalAssetCount}
                {t('mainnavbar:total-asset-count:posttext')}
              </span>
              <span className="text-card-foreground font-bold px-2 rounded-lg">
                {showingCount}
                {t('general:count')}
              </span>
              <span className="text-muted-foreground">
                {t('mainnavbar:showing')}
              </span>
            </div>
            <div className="w-28 ml-auto mr-2">
              {totalAssetCount !== showingCount && (
                <Button
                  className="h-8"
                  variant={'outline'}
                  onClick={clearFilters}
                >
                  {t('general:clear-filter')}
                </Button>
              )}
            </div>
          </Card>
        </div>
        <div className="w-fit mx-2 flex items-center">
          <LayoutPopover />
        </div>
      </div>
    </div>
  )
}

export default NavBar
