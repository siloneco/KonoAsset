'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

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

  const height = data.length * 30

  return (
    <Card className="flex flex-col w-full shrink">
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
            accessibilityLayer
            data={data}
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
                    console.log(item)
                    return (
                      <div>
                        <p className="font-bold">{item.payload.name}</p>
                        <div className="flex flex-row gap-2">
                          <p className="text-muted-foreground">
                            {t('preference:statistics:volume-bar-chart:size')}
                          </p>
                          <p>{bytesFormatter(value as number)}</p>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar
              dataKey="sizeInBytes"
              layout="vertical"
              fill="var(--color-avatar-wearable)"
              radius={4}
              animationDuration={loading ? 0 : 500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.assetType === 'Avatar'
                      ? 'var(--avatar)'
                      : entry.assetType === 'AvatarWearable'
                        ? 'var(--avatar-wearable)'
                        : 'var(--world-object)'
                  }
                />
              ))}
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground"
                fontSize={12}
                content={(props) => {
                  const { index, x, y, height, offset, value, width } = props
                  const item = data[index!]

                  let fillColor = 'var(--foreground)'

                  if (item.assetType === 'Avatar') {
                    fillColor = 'var(--avatar-foreground)'
                  } else if (item.assetType === 'AvatarWearable') {
                    fillColor = 'var(--avatar-wearable-foreground)'
                  } else if (item.assetType === 'WorldObject') {
                    fillColor = 'var(--world-object-foreground)'
                  }

                  return (
                    <text
                      x={((x ?? 0) as number) + (offset as number)}
                      y={(y as number) + (height as number) / 2}
                      dominantBaseline="middle"
                      fill={fillColor}
                      textAnchor="start"
                    >
                      {truncateText(value, width as number)}
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
                formatter={(value: number) => {
                  return bytesFormatter(value)
                }}
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

const truncateText = (text: string | number | undefined, width: number) => {
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
