import { FC } from 'react'
import { useAssetCardMeatballMenu } from './hook'
import { InternalAssetCardMeatballMenu } from './internal'

type Props = {
  id: string
  className?: string
  boothItemID?: number
  openDataManagementDialog: () => void
  openEditAssetDialog: () => void
}

export const AssetCardMeatballMenu: FC<Props> = ({
  id,
  className,
  boothItemID,
  openDataManagementDialog,
  openEditAssetDialog,
}) => {
  const { boothUrl, executeAssetDeletion } = useAssetCardMeatballMenu({
    id,
    boothItemID,
  })

  return (
    <InternalAssetCardMeatballMenu
      className={className}
      boothUrl={boothUrl ?? undefined}
      openEditAssetDialog={openEditAssetDialog}
      openDataManagementDialog={openDataManagementDialog}
      executeAssetDeletion={executeAssetDeletion}
    />
  )
}
