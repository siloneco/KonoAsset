import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AssetDisplay } from '@/lib/entity'
import { convertFileSrc } from '@tauri-apps/api/core'
import { Folder } from 'lucide-react'
import { MoreButton } from '../MoreButton'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { title } from 'process'
import { useAssetCard } from './hook'
import AssetBadge from '@/components/part/AssetBadge'

type Props = {
  asset: AssetDisplay
}

const AssetCard = ({ asset }: Props) => {
  const { openInFileManager, deleteAsset } = useAssetCard({ asset })

  return (
    <Card className="w-full bg-card m-1">
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <AspectRatio
            ratio={1}
            className="w-full flex items-center bg-white rounded-lg overflow-hidden"
          >
            <img
              src={convertFileSrc(asset.image_src)}
              alt={title}
              className="w-full"
            />
          </AspectRatio>
          <AssetBadge type={asset.asset_type} className="mt-3" />
          <CardTitle className="text-lg mt-2 break-words whitespace-pre-wrap">
            {title}
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
