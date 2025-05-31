import { Card } from '@/components/ui/card'
import { FC, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { useLocalization } from '@/hooks/use-localization'
import { LayoutPopover } from './components/LayoutPopover'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { DEFAULT_CRITERIA } from '@/components/functional/AssetFilterContext/AssetFilterContext.constants'

export const NavBar: FC = () => {
  const { updateFilter } = useContext(AssetFilterContext)
  const { sortedAssetSummaries } = useAssetSummaryStore()
  const { matchedAssetIds } = useContext(AssetFilterContext)

  const { t } = useLocalization()

  const totalAssetCount = sortedAssetSummaries.length
  const showingCount =
    matchedAssetIds !== null ? matchedAssetIds.length : totalAssetCount

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
                  onClick={() => updateFilter(DEFAULT_CRITERIA)}
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
