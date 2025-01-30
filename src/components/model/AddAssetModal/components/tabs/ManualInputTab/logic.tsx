import {
  AssetDescription,
  AssetType,
  AvatarImportRequest,
  AvatarWearableImportRequest,
  commands,
  PreAvatar,
  PreAvatarWearable,
  PreWorldObject,
  Result,
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
  assetPaths: string[],
  preAsset: PreAvatar | PreAvatarWearable | PreWorldObject,
  deleteSource: boolean,
): Promise<Result<string, string>> => {
  console.log('test')
  if (assetType === 'Avatar') {
    const request: AvatarImportRequest = {
      preAsset: preAsset as PreAvatar,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestAvatarImport(request)
  } else if (assetType === 'AvatarWearable') {
    const request: AvatarWearableImportRequest = {
      preAsset: preAsset as PreAvatarWearable,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestAvatarWearableImport(request)
  } else if (assetType === 'WorldObject') {
    const request: WorldObjectImportRequest = {
      preAsset: preAsset as PreWorldObject,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestWorldObjectImport(request)
  } else {
    return { status: 'error', error: `Unsupported asset type: ${assetType}` }
  }
}
