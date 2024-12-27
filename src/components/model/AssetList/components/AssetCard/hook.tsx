import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { AssetSummary, commands } from '@/lib/bindings'
import { useContext } from 'react'

type Props = {
  asset: AssetSummary
}

type ReturnProps = {
  openInFileManager: () => Promise<void>
  deleteAsset: () => Promise<void>
}

export const useAssetCard = ({ asset }: Props): ReturnProps => {
  const { deleteAssetById } = useContext(AssetContext)
  const { toast } = useToast()

  const openInFileManager = async () => {
    const result = await commands.openInFileManager(asset.id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
    }
  }

  const deleteAsset = async () => {
    const result = await commands.requestAssetDeletion(asset.id)

    if (result.status === 'ok') {
      // アセットを一覧から削除
      deleteAssetById(asset.id)

      toast({
        title: '正常に削除されました！',
      })
    } else {
      toast({
        title: '削除に失敗しました',
        description: result.error,
      })
    }
  }

  return { openInFileManager, deleteAsset }
}
