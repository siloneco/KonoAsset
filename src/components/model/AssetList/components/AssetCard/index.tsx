import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MoreButton } from '../MoreButton'
import { useAssetCard } from './hook'
import AssetBadge from '@/components/part/AssetBadge'
import { Label } from '@/components/ui/label'
import { RefObject, useContext } from 'react'
import SquareImage from '@/components/model/SquareImage'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary, FileInfo } from '@/lib/bindings'
import AssetCardOpenButton from '@/components/model/AssetList/components/AssetCardOpenButton'

type Props = {
  asset: AssetSummary
  ref?: RefObject<HTMLDivElement | null>

  openSelectUnitypackageDialog: () => void
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
  setDialogAssetId: (assetId: string | null) => void

  openDataManagementDialog: (assetId: string) => void
}

const AssetCard = ({
  asset,
  ref,
  openSelectUnitypackageDialog,
  setUnitypackageFiles,
  setDialogAssetId,
  openDataManagementDialog,
}: Props) => {
  const { deleteAsset } = useAssetCard({ asset })
  const { setAssetType } = useContext(PersistentContext)

  return (
    <Card className="w-full bg-card m-1" ref={ref}>
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <SquareImage
            assetType={asset.assetType}
            filename={asset.imageFilename ?? undefined}
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
          <AssetCardOpenButton
            className="w-full mr-2"
            id={asset.id}
            openSelectUnitypackageDialog={openSelectUnitypackageDialog}
            setUnitypackageFiles={(obj) => {
              setUnitypackageFiles(obj)
              setDialogAssetId(asset.id)
            }}
          />
          <MoreButton
            id={asset.id}
            executeAssetDeletion={deleteAsset}
            boothItemID={asset.boothItemId ?? undefined}
            openDataManagementDialog={() => {
              openDataManagementDialog(asset.id)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetCard
