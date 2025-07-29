import { AssetDescription, AssetSummary, commands } from '@/lib/bindings'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'

type CurrentAssetType = Pick<AssetSummary, 'id'> &
  Pick<AssetDescription, 'name'> & {
    dependencies: AssetSummary[]
  }

type ReturnType = CurrentAssetType | null

export const fetchDependencies = async (
  assetId: string,
): Promise<ReturnType> => {
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
      dependencies: constructAssets(avatar?.description.dependencies ?? []),
    }
  } else if (assetType === 'AvatarWearable') {
    return {
      id: assetId,
      name: avatarWearable?.description.name ?? '',
      dependencies: constructAssets(
        avatarWearable?.description.dependencies ?? [],
      ),
    }
  } else if (assetType === 'WorldObject') {
    return {
      id: assetId,
      name: worldObject?.description.name ?? '',
      dependencies: constructAssets(
        worldObject?.description.dependencies ?? [],
      ),
    }
  } else if (assetType === 'OtherAsset') {
    return {
      id: assetId,
      name: otherAsset?.description.name ?? '',
      dependencies: constructAssets(otherAsset?.description.dependencies ?? []),
    }
  }

  return null
}

const constructAssets = (dependencyIds: string[]): AssetSummary[] => {
  const assetSummaries =
    useAssetSummaryViewStore.getState().sortedAssetSummaries

  const assets = assetSummaries.filter((asset) =>
    dependencyIds.includes(asset.id),
  )

  assets.sort((a, b) => {
    const aIndex = dependencyIds.indexOf(a.id)
    const bIndex = dependencyIds.indexOf(b.id)
    return aIndex - bIndex
  })

  return assets
}
