import { cn } from '@/lib/utils'
import { AssetSummary } from '@/lib/bindings'
import { AssetCard } from '../../asset-card/AssetCard'
import { ComponentProps, FC } from 'react'

type Props = {
  sortedAssetSummaries: AssetSummary[]
  columnCount: number
} & Omit<ComponentProps<typeof AssetCard>, 'asset'>

export const AssetViewGridLayout: FC<Props> = ({
  sortedAssetSummaries,
  columnCount,
  ...props
}) => {
  return (
    <div
      className={cn(`grid gap-4 mx-6`)}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {sortedAssetSummaries.map((asset) => (
        <AssetCard key={asset.id} asset={asset} {...props} />
      ))}
    </div>
  )
}
