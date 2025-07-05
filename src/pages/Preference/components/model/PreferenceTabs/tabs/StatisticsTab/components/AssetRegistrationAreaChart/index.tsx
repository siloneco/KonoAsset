'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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

type AssetCountPerDay = {
  date: string

  avatars: number
  avatarWearables: number
  worldObjects: number
  otherAssets: number
}

type Props = {
  data: AssetCountPerDay[]
}

export const AssetRegistrationAreaChart: React.FC<Props> = ({ data }) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('preference:statistics:asset-count-area-chart:title')}
        </CardTitle>
        <CardDescription>
          {t('preference:statistics:asset-count-area-chart:description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-48 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={(props) => (
                <ChartTooltipContent {...props} indicator="dot" />
              )}
            />
            <Area
              dataKey="avatars"
              type="linear"
              fill="var(--color-avatar)"
              fillOpacity={0.7}
              stroke="var(--color-avatar)"
              stackId="a"
            />
            <Area
              dataKey="avatarWearables"
              type="linear"
              fill="var(--color-avatar-wearable)"
              fillOpacity={0.7}
              stroke="var(--color-avatar-wearable)"
              stackId="a"
            />
            <Area
              dataKey="worldObjects"
              type="linear"
              fill="var(--color-world-object)"
              fillOpacity={0.7}
              stroke="var(--color-world-object)"
              stackId="a"
            />
            <Area
              dataKey="otherAssets"
              type="linear"
              fill="var(--color-other-asset)"
              fillOpacity={0.7}
              stroke="var(--color-other-asset)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
