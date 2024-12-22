import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { AssetDisplay } from '@/lib/entity'
import { Folder } from 'lucide-react'
import { MoreButton } from '../MoreButton'
import { useAssetCard } from './hook'
import AssetBadge from '@/components/part/AssetBadge'
import { Label } from '@/components/ui/label'
import { RefObject } from 'react'
import SquareImage from '@/components/model/SquareImage'

type Props = {
  asset: AssetDisplay
  ref?: RefObject<HTMLDivElement | null>
}

const AssetCard = ({ asset, ref }: Props) => {
  const { openInFileManager, deleteAsset } = useAssetCard({ asset })

  return (
    <Card className="w-full bg-card m-1" ref={ref}>
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <SquareImage
            assetType={asset.asset_type}
            path={asset.image_src ?? undefined}
          />
          <AssetBadge type={asset.asset_type} className="mt-3" />
          <CardTitle className="text-lg mt-2 break-words whitespace-pre-wrap">
            {asset.title}
          </CardTitle>
          <Label className="text-sm">{asset.author}</Label>
        </div>
        <div className="flex flex-row mt-2">
          <Button className="w-full mr-2" onClick={openInFileManager}>
            <Folder size={24} />
            <p>開く</p>
          </Button>
          <MoreButton
            id={asset.id}
            executeAssetDeletion={deleteAsset}
            booth_url={asset.booth_url ?? undefined}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetCard
