import { Result } from '@/lib/bindings'
import { useCallback } from 'react'

type Props = {
  getAssetDirectoryPath: (assetId: string) => Promise<Result<string, string>>
}

type ReturnProps = {
  onCopyPathButtonClick: (assetId: string) => Promise<void>
}

export const useAssetViewListLayout = (props: Props): ReturnProps => {
  const onCopyPathButtonClick = useCallback(
    async (assetId: string) => {
      const result = await props.getAssetDirectoryPath(assetId)
      if (result.status === 'ok') {
        await navigator.clipboard.writeText(result.data)
      }
    },
    [props],
  )

  return {
    onCopyPathButtonClick,
  }
}
