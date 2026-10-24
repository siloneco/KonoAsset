import * as React from 'react'
import { Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  avatars: number
  avatarWearables: number
  worldObjects: number
  otherAssets: number
}

export const AssetCountPieChart: React.FC<Props> = ({
  avatars,
  avatarWearables,
  worldObjects,
  otherAssets,
}) => {
  const { t } = useLocalization()

  const chartConfig = {
    type: {
      label: 'Assets',
    },
    avatars: {
      label: t('general:typeavatar-multiple'),
      color: 'var(--avatar)',
    },
    avatarWearables: {
      label: t('general:typeavatarwearable-multiple'),
      color: 'var(--avatar-wearable)',
    },
    worldObjects: {
      label: t('general:typeworldobject-multiple'),
      color: 'var(--world-object)',
    },
    otherAssets: {
      label: t('general:typeotherasset-multiple'),
      color: 'var(--other-asset)',
    },
  } satisfies ChartConfig

  const chartData = [
    { type: 'avatars', count: avatars, fill: 'var(--color-avatars)' },
    {
      type: 'avatarWearables',
      count: avatarWearables,
      fill: 'var(--color-avatarWearables)',
    },
    {
      type: 'worldObjects',
      count: worldObjects,
      fill: 'var(--color-worldObjects)',
    },
    {
      type: 'otherAssets',
      count: otherAssets,
      fill: 'var(--color-otherAssets)',
    },
  ]

  const totalAssets = avatars + avatarWearables + worldObjects + otherAssets

  return (
    <Card
      data-testid="asset-type-chart"
      className="flex flex-col w-full h-full"
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {t('preference:statistics:asset-count-pie-chart:title')}
        </CardTitle>
        <CardDescription>
          {t('preference:statistics:asset-count-pie-chart:description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 px-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart
            aria-label={t('preference:statistics:asset-count-pie-chart:title')}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={80}
              strokeWidth={5}
              startAngle={-270}
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" className="fill-foreground text-3xl font-bold">
                {totalAssets.toLocaleString()}
              </tspan>
              <tspan x="50%" dy={24} className="fill-muted-foreground">
                {t('preference:statistics:asset-count-pie-chart:unit')}
              </tspan>
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
