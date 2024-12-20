import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { AssetDisplay, DirectoryOpenResult, SimpleResult } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { useContext } from 'react'

type Props = {
  asset: AssetDisplay
}

type ReturnProps = {
  openInFileManager: () => Promise<void>
  deleteAsset: () => Promise<void>
}

export const useAssetCard = ({ asset }: Props): ReturnProps => {
  const { deleteAssetById } = useContext(AssetContext)
  const { toast } = useToast()

  const openInFileManager = async () => {
    const result: DirectoryOpenResult = await invoke('open_in_file_manager', {
      id: asset.id,
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
      id: asset.id,
    })

    if (result.success) {
      // アセットを一覧から削除
      deleteAssetById(asset.id)

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

  return { openInFileManager, deleteAsset }
}
