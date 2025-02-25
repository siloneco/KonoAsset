import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { AssetSummary, commands } from '@/lib/bindings'
import { useContext } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  asset: AssetSummary
}

type ReturnProps = {
  deleteAsset: () => Promise<void>
}

export const useAssetCard = ({ asset }: Props): ReturnProps => {
  const { deleteAssetById } = useContext(AssetContext)
  const { t } = useLocalization()
  const { toast } = useToast()

  const deleteAsset = async () => {
    const result = await commands.requestAssetDeletion(asset.id)

    if (result.status === 'ok') {
      // アセットを一覧から削除
      deleteAssetById(asset.id)

      toast({
        title: t('assetcard:success-delete-toast'),
      })
    } else {
      toast({
        title: t('assetcard:fail-delete-toast'),
        description: result.error,
      })
    }
  }

  return { deleteAsset }
}
