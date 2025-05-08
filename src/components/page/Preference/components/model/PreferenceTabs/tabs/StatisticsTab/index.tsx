import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { TabsContent } from '@/components/ui/tabs'
import { FC } from 'react'
import { AssetCountPieChart } from './components/AssetCountPieChart'
import { AssetRegistrationAreaChart } from './components/AssetRegistrationAreaChart'
import { NumberDisplay } from './components/NumberDisplay'
import { AssetDiskSizeBarChart } from './components/AssetDiskSizeBarChart'
import { useStatisticsTab } from './hook'

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

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="p-8 w-full h-full grid grid-cols-1 gap-4">
        <div className="w-full grid grid-rows-2 grid-cols-5 gap-4">
          <div className="col-span-3 row-span-1">
            <NumberDisplay title="アセット登録数" number={total} unit="個" />
          </div>
          <div className="col-span-3 row-span-1 row-start-2 flex flex-row gap-4">
            <NumberDisplay title="アバター" number={avatars} unit="個" />
            <NumberDisplay
              title="アバター関連アセット"
              number={avatarWearables}
              unit="個"
            />
            <NumberDisplay
              title="ワールドアセット"
              number={worldObjects}
              unit="個"
            />
          </div>
          <div className="row-span-2 col-span-2">
            <AssetCountPieChart
              avatars={8}
              avatarWearables={94}
              worldObjects={17}
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
