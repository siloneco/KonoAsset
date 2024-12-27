import {
  AssetDescription,
  AssetType,
  Avatar,
  AvatarImportRequest,
  AvatarWearable,
  AvatarWearableImportRequest,
  commands,
  PreAvatar,
  PreAvatarWearable,
  PreWorldObject,
  Result,
  WorldObject,
  WorldObjectImportRequest,
} from '@/lib/bindings'

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
  PreAvatar | PreAvatarWearable | PreWorldObject,
  string
> => {
  if (assetType === 'Avatar') {
    const preAsset: PreAvatar = {
      description,
    }

    return { status: 'ok', data: preAsset }
  } else if (assetType === 'AvatarWearable') {
    const preAsset: PreAvatarWearable = {
      description,
      category: category!,
      supportedAvatars: supportedAvatars!,
    }

    return { status: 'ok', data: preAsset }
  } else if (assetType === 'WorldObject') {
    const preAsset: PreWorldObject = {
      description,
      category: category!,
    }

    return { status: 'ok', data: preAsset }
  } else {
    return { status: 'error', error: `Unsupported asset type: ${assetType}` }
  }
}

export const sendAssetImportRequest = async (
  assetType: AssetType,
  assetPath: string,
  preAsset: PreAvatar | PreAvatarWearable | PreWorldObject,
): Promise<Result<Avatar | AvatarWearable | WorldObject, string>> => {
  if (assetType === 'Avatar') {
    const request: AvatarImportRequest = {
      preAsset: preAsset,
      absolutePath: assetPath,
    }

    return await commands.requestAvatarImport(request)
  } else if (assetType === 'AvatarWearable') {
    const request: AvatarWearableImportRequest = {
      preAsset: preAsset as PreAvatarWearable,
      absolutePath: assetPath,
    }

    return await commands.requestAvatarWearableImport(request)
  } else if (assetType === 'WorldObject') {
    const request: WorldObjectImportRequest = {
      preAsset: preAsset as PreWorldObject,
      absolutePath: assetPath,
    }

    return await commands.requestWorldObjectImport(request)
  } else {
    return { status: 'error', error: `Unsupported asset type: ${assetType}` }
  }
}
