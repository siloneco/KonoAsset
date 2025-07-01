import {
  AssetDescription,
  AssetImportRequest,
  AssetType,
  commands,
  PreAvatar,
  PreAvatarWearable,
  PreOtherAsset,
  PreWorldObject,
  Result,
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
  PreAvatar | PreAvatarWearable | PreWorldObject | PreOtherAsset,
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
  } else if (assetType === 'OtherAsset') {
    const preAsset: PreOtherAsset = {
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
  if (assetType === 'Avatar') {
    const request: AssetImportRequest<PreAvatar> = {
      preAsset: preAsset as PreAvatar,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestAvatarImport(request)
  } else if (assetType === 'AvatarWearable') {
    const request: AssetImportRequest<PreAvatarWearable> = {
      preAsset: preAsset as PreAvatarWearable,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestAvatarWearableImport(request)
  } else if (assetType === 'WorldObject') {
    const request: AssetImportRequest<PreWorldObject> = {
      preAsset: preAsset as PreWorldObject,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestWorldObjectImport(request)
  } else if (assetType === 'OtherAsset') {
    const request: AssetImportRequest<PreOtherAsset> = {
      preAsset: preAsset as PreOtherAsset,
      absolutePaths: assetPaths,
      deleteSource,
    }

    return await commands.requestOtherAssetImport(request)
  } else {
    return { status: 'error', error: `Unsupported asset type: ${assetType}` }
  }
}
