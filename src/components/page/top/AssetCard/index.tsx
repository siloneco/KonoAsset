import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  SimpleResult,
  AssetDescription,
  AssetType,
  DirectoryOpenResult,
} from '@/lib/entity'
import { convertFileSrc, invoke } from '@tauri-apps/api/core'
import { Folder } from 'lucide-react'
import { MoreButton } from './components/MoreButton'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { AssetContext } from '@/components/context/AssetContext'
import { useContext } from 'react'

type Props = {
  id: string
  assetType: AssetType
  assetDescription: AssetDescription
}

const AssetCard = ({ id, assetType, assetDescription }: Props) => {
  const { deleteAvatarAsset, deleteAvatarRelatedAsset, deleteWorldAsset } =
    useContext(AssetContext)
  const { toast } = useToast()

  const openInFileManager = async () => {
    const result: DirectoryOpenResult = await invoke('open_in_file_manager', {
      id,
    })

    if (!result.success) {
      toast({
        title: 'エラー',
        description: result.error_message,
      })
    }
  }

  const deleteAsset = async () => {
    const result: SimpleResult = await invoke('request_asset_deletion', {
      id,
    })

    if (result.success) {
      // アセットを一覧から削除
      deleteAvatarAsset(id)
      deleteAvatarRelatedAsset(id)
      deleteWorldAsset(id)

      toast({
        title: '正常に削除されました！',
      })
    } else {
      toast({
        title: '削除に失敗しました',
        description: result.error_message,
      })
    }
  }

  return (
    <Card className="w-full bg-card m-1">
      <CardContent className="p-4 h-full">
        <div className="h-[calc(100%-3rem)]">
          <AspectRatio
            ratio={1}
            className="w-full flex items-center bg-white rounded-lg overflow-hidden"
          >
            <img
              src={convertFileSrc(assetDescription.image_src)}
              alt={assetDescription.title}
              className="w-full"
            />
          </AspectRatio>
          <div className="mt-3">
            {assetType === AssetType.Avatar && (
              <Badge variant="avatar">アバター素体</Badge>
            )}
            {assetType === AssetType.AvatarRelated && (
              <Badge variant="avatarRelated">アバター関連</Badge>
            )}
            {assetType === AssetType.World && (
              <Badge variant="world">ワールドアセット</Badge>
            )}
          </div>
          <CardTitle className="text-lg mt-2 break-words whitespace-pre-wrap">
            {assetDescription.title}
          </CardTitle>
          <Label className="text-sm">{assetDescription.author}</Label>
        </div>
        <div className="flex flex-row mt-2">
          <Button className={'w-full mr-2'} onClick={openInFileManager}>
            <Folder size={24} />
            <p>開く</p>
          </Button>
          <MoreButton id={id} executeAssetDeletion={deleteAsset} />
        </div>
      </CardContent>
    </Card>
  )
}

export default AssetCard
