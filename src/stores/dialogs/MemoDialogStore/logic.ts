import { AssetDescription, AssetSummary, commands } from '@/lib/bindings'

type ReturnType =
  | (Pick<AssetSummary, 'id'> & Pick<AssetDescription, 'name' | 'memo'>)
  | null

export const fetchAssetInfo = async (assetId: string): Promise<ReturnType> => {
  const result = await commands.getAsset(assetId)

  if (result.status === 'error') {
    console.error(result.error)
    return null
  }

  const { assetType, avatar, avatarWearable, worldObject, otherAsset } =
    result.data

  if (assetType === 'Avatar') {
    return {
      id: assetId,
      name: avatar?.description.name ?? '',
      memo: avatar?.description.memo ?? '',
    }
  } else if (assetType === 'AvatarWearable') {
    return {
      id: assetId,
      name: avatarWearable?.description.name ?? '',
      memo: avatarWearable?.description.memo ?? '',
    }
  } else if (assetType === 'WorldObject') {
    return {
      id: assetId,
      name: worldObject?.description.name ?? '',
      memo: worldObject?.description.memo ?? '',
    }
  } else if (assetType === 'OtherAsset') {
    return {
      id: assetId,
      name: otherAsset?.description.name ?? '',
      memo: otherAsset?.description.memo ?? '',
    }
  }

  return null
}
