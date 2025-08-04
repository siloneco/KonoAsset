import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useCallback, useEffect, useState } from 'react'
import { deleteAsset, fetchBoothUrl } from '../logic'

type Props = {
  id: string
  boothItemID?: number
}

type ReturnProps = {
  boothUrl: string | null
  executeAssetDeletion: () => Promise<void>
}

export const useAssetCardMeatballMenu = ({
  id,
  boothItemID,
}: Props): ReturnProps => {
  const { t } = useLocalization()
  const { toast } = useToast()

  const [boothUrl, setBoothUrl] = useState<string | null>(null)

  const deleteAssetSummaryFromFrontend = useAssetSummaryViewStore(
    (state) => state.deleteAssetSummaryFromFrontend,
  )

  const executeAssetDeletion = useCallback(async () => {
    await deleteAsset({
      id,
      deleteFromFrontend: deleteAssetSummaryFromFrontend,
      successToast: () =>
        toast({
          title: t('assetcard:more-button:success-delete-toast'),
        }),
      failedToast: (error: string) =>
        toast({
          title: t('assetcard:more-button:fail-delete-toast'),
          description: error,
        }),
    })
  }, [id, deleteAssetSummaryFromFrontend, toast, t])

  useEffect(() => {
    if (boothItemID === undefined) {
      setBoothUrl(null)
      return
    }

    fetchBoothUrl(boothItemID).then(setBoothUrl)
  }, [boothItemID])

  return {
    boothUrl,
    executeAssetDeletion,
  }
}
