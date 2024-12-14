import {
  AssetDescription,
  AssetImportRequest,
  AssetImportResult,
  AssetType,
  AvatarAsset,
  AvatarRelatedAssets,
  PreAvatarAsset,
  PreAvatarRelatedAssets,
  PreWorldRelatedAssets,
  WorldRelatedAssets,
} from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import { Failure, Result, Success } from '@/lib/Result'

type CreatePreAssetProps = {
  assetType: AssetType
  description: AssetDescription
  category?: string
  supportedAvatars?: string[]
}

export const createPreAsset = ({
  assetType,
  description,
  category,
  supportedAvatars,
}: CreatePreAssetProps): Result<
  PreAvatarAsset | PreAvatarRelatedAssets | PreWorldRelatedAssets,
  Error
> => {
  if (assetType === AssetType.Avatar) {
    const preAsset: PreAvatarAsset = {
      description,
    }

    return new Success(preAsset)
  } else if (assetType === AssetType.AvatarRelated) {
    const preAsset: PreAvatarRelatedAssets = {
      description,
      category: category!,
      supported_avatars: supportedAvatars!,
    }

    return new Success(preAsset)
  } else if (assetType === AssetType.World) {
    const preAsset: PreWorldRelatedAssets = {
      description,
      category: category!,
    }

    return new Success(preAsset)
  } else {
    return new Failure(new Error(`Unsupported asset type: ${assetType}`))
  }
}

export const sendAssetImportRequest = async (
  assetType: AssetType,
  assetPath: string,
  preAsset: PreAvatarAsset | PreAvatarRelatedAssets | PreWorldRelatedAssets,
): Promise<
  Result<AvatarAsset | AvatarRelatedAssets | WorldRelatedAssets, Error>
> => {
  const request: AssetImportRequest = {
    file_or_dir_absolute_path: assetPath,
    pre_asset: preAsset,
  }

  let callTarget: string

  if (assetType === AssetType.Avatar) {
    callTarget = 'request_avatar_asset_import'
  } else if (assetType === AssetType.AvatarRelated) {
    callTarget = 'request_avatar_related_asset_import'
  } else if (assetType === AssetType.World) {
    callTarget = 'request_world_asset_import'
  } else {
    return new Failure(new Error(`Unsupported asset type: ${assetType}`))
  }

  const result: AssetImportResult = await invoke(callTarget, { request })

  if (result.success) {
    return new Success(result.asset!)
  } else {
    return new Failure(new Error(result.error_message))
  }
}
