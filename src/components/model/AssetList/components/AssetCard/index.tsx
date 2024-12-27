import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Folder } from 'lucide-react'
import { MoreButton } from '../MoreButton'
import { useAssetCard } from './hook'
import AssetBadge from '@/components/part/AssetBadge'
import { Label } from '@/components/ui/label'
import { RefObject, useContext } from 'react'
import SquareImage from '@/components/model/SquareImage'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary } from '@/lib/bindings'

type Props = {
  asset: AssetSummary
  ref?: RefObject<HTMLDivElement | null>
}

const AssetCard = ({ asset, ref }: Props) => {
  const { openInFileManager, deleteAsset } = useAssetCard({ asset })
  const { setAssetType } = useContext(PersistentContext)

  return (
    <Card className="w-full bg-card m-1" ref={ref}>
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <SquareImage
            assetType={asset.assetType}
            path={asset.imagePath ?? undefined}
          />
          <AssetBadge
            type={asset.assetType}
            className="mt-3 select-none cursor-pointer"
            onClick={() => setAssetType(asset.assetType)}
          />
          <CardTitle className="text-lg mt-2 break-words whitespace-pre-wrap">
            {asset.name}
          </CardTitle>
          <Label className="text-sm">{asset.creator}</Label>
        </div>
        <div className="flex flex-row mt-2">
          <Button className="w-full mr-2" onClick={openInFileManager}>
            <Folder size={24} />
            <p>開く</p>
          </Button>
          <MoreButton
            id={asset.id}
            executeAssetDeletion={deleteAsset}
            boothItemID={asset.boothItemId ?? undefined}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetCard
