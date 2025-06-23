import { PersistentContext } from '@/components/context/PersistentContext'
import { Card } from '@/components/ui/card'

import { useContext, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { LayoutPopover } from './components/LayoutPopover'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

type Props = {
  displayAssetCount?: number
}

export const NavBar = ({ displayAssetCount }: Props) => {
  const { clearFilters } = useContext(PersistentContext)
  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

  const { t } = useLocalization()
  const totalAssetCount = useMemo(
    () => sortedAssetSummaries.length,
    [sortedAssetSummaries],
  )
  const showingCount = useMemo(
    () => displayAssetCount ?? totalAssetCount,
    [displayAssetCount, totalAssetCount],
  )

  return (
    <div className="p-4">
      <div className="flex flex-row w-full">
        <div className="w-full">
          <Card className="min-h-10 flex flex-row items-center p-0 gap-0">
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
            <div className="w-28 ml-auto mr-3">
              {totalAssetCount !== showingCount && (
                <Button
                  className="h-8"
                  variant="secondary"
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
