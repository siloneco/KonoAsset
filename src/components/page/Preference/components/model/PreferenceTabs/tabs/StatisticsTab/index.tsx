import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { TabsContent } from '@/components/ui/tabs'
import { FC } from 'react'
import { AssetCountPieChart } from './components/AssetCountPieChart'
import { AssetRegistrationAreaChart } from './components/AssetRegistrationAreaChart'
import { NumberDisplay } from './components/NumberDisplay'
import { AssetDiskSizeBarChart } from './components/AssetDiskSizeBarChart'
import { useStatisticsTab } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  id: PreferenceTabIDs
}

export const StatisticsTab: FC<Props> = ({ id }) => {
  const {
    assetRegistrationAreaChartData,
    assetVolumeStatistics,
    loadingAssetVolumeStatistics,
    total,
    avatars,
    avatarWearables,
    worldObjects,
  } = useStatisticsTab()
  const { t } = useLocalization()

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="p-8 w-full max-w-[1200px] mx-auto h-full grid grid-cols-1 gap-3">
        <div className="w-full grid grid-rows-2 grid-cols-5 gap-3">
          <div className="col-span-3 row-span-1">
            <NumberDisplay
              title={t('preference:statistics:total')}
              number={total}
              unit={t('preference:statistics:unit')}
            />
          </div>
          <div className="col-span-3 row-span-1 row-start-2 flex flex-row gap-3">
            <NumberDisplay
              title={t('general:typeavatar-multiple')}
              number={avatars}
              unit={t('preference:statistics:unit')}
            />
            <NumberDisplay
              title={t('general:typeavatarwearable-multiple')}
              number={avatarWearables}
              unit={t('preference:statistics:unit')}
            />
            <NumberDisplay
              title={t('general:typeworldobject-multiple')}
              number={worldObjects}
              unit={t('preference:statistics:unit')}
            />
          </div>
          <div className="row-span-2 col-span-2">
            <AssetCountPieChart
              avatars={avatars}
              avatarWearables={avatarWearables}
              worldObjects={worldObjects}
            />
          </div>
        </div>
        <AssetRegistrationAreaChart data={assetRegistrationAreaChartData} />
        <AssetDiskSizeBarChart
          data={assetVolumeStatistics}
          loading={loadingAssetVolumeStatistics}
        />
        <div className="h-2" />
      </div>
    </TabsContent>
  )
}
