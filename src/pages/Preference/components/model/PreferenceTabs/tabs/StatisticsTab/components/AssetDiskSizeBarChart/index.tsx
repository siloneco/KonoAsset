'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

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
import { AssetVolumeStatistics } from '@/lib/bindings'
import { Loader2 } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  data: AssetVolumeStatistics[]
  loading: boolean
}

export const AssetDiskSizeBarChart: React.FC<Props> = ({ data, loading }) => {
  const { t } = useLocalization()

  const chartConfig = {
    asset: {
      label: 'Size',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig

  const height = Math.max(data.length, 1) * 30
  const chartData = data.map((entry) => ({
    ...entry,
    fill:
      entry.assetType === 'Avatar'
        ? 'var(--avatar)'
        : entry.assetType === 'AvatarWearable'
          ? 'var(--avatar-wearable)'
          : entry.assetType === 'WorldObject'
            ? 'var(--world-object)'
            : 'var(--other-asset)',
  }))

  return (
    <Card
      data-testid="asset-disk-usage"
      aria-busy={loading}
      className="flex flex-col w-full shrink"
    >
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center gap-2">
            {t('preference:statistics:volume-bar-chart:title')}
            {loading && (
              <Loader2 className="animate-spin text-muted-foreground size-6" />
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {t('preference:statistics:volume-bar-chart:description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="flex w-full shrink"
          style={{
            height: height,
          }}
        >
          <BarChart
            aria-label={t('preference:statistics:volume-bar-chart:title')}
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 60,
            }}
            barSize={25}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="sizeInBytes" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, _, item) => {
                    return (
                      <div>
                        <p className="font-bold">{item.payload.name}</p>
                        <div className="flex flex-row gap-2">
                          <p className="text-muted-foreground">
                            {t('preference:statistics:volume-bar-chart:size')}
                          </p>
                          <p>
                            {typeof value === 'number'
                              ? bytesFormatter(value)
                              : null}
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar
              dataKey="sizeInBytes"
              fill="var(--color-asset)"
              radius={4}
              animationDuration={loading ? 0 : 500}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground"
                fontSize={12}
                content={(props) => {
                  const { index, viewBox, offset = 8 } = props
                  const item = index === undefined ? undefined : data[index]
                  if (
                    !item ||
                    !viewBox ||
                    !('x' in viewBox) ||
                    !('y' in viewBox) ||
                    !('width' in viewBox) ||
                    !('height' in viewBox)
                  ) {
                    return null
                  }
                  const { x = 0, y = 0, width = 0, height = 0 } = viewBox

                  let fillColor = 'var(--foreground)'

                  if (item.assetType === 'Avatar') {
                    fillColor = 'var(--avatar-foreground)'
                  } else if (item.assetType === 'AvatarWearable') {
                    fillColor = 'var(--avatar-wearable-foreground)'
                  } else if (item.assetType === 'WorldObject') {
                    fillColor = 'var(--world-object-foreground)'
                  } else if (item.assetType === 'OtherAsset') {
                    fillColor = 'var(--other-asset-foreground)'
                  }

                  return (
                    <text
                      x={x + offset}
                      y={y + height / 2}
                      dominantBaseline="middle"
                      fill={fillColor}
                      textAnchor="start"
                    >
                      {truncateText(item.name, width)}
                    </text>
                  )
                }}
              />
              <LabelList
                dataKey="sizeInBytes"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                width={75}
                formatter={(value) =>
                  typeof value === 'number' ? bytesFormatter(value) : ''
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const bytesFormatter = (value: number) => {
  if (value < 1024) {
    return `${value} Bytes`
  } else if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(2)} KB`
  } else if (value < 1024 * 1024 * 1024) {
    return `${(value / 1024 / 1024).toFixed(2)} MB`
  } else {
    return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`
  }
}

const truncateText = (text: string, width: number) => {
  const strText = `${text}`
  let totalWidth = 0
  let endIndex = 0

  for (let i = 0; i < strText.length; i++) {
    // Check if the character is full-width (CJK characters, etc.)
    const charWidth = /[\u3000-\u9fff\uff00-\uffef]/.test(strText[i]) ? 10 : 6

    if (totalWidth + charWidth > width - 30) {
      break
    }

    totalWidth += charWidth
    endIndex = i + 1
  }

  if (endIndex === 0) {
    return ''
  }

  if (endIndex < strText.length) {
    return strText.slice(0, endIndex) + '...'
  }

  return text
}
