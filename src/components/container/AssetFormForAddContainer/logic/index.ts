import { AssetSubmissionData } from '@/components/presentation/asset-form/AssetFormForAdd/AssetFormForAdd'
import { Option } from '@/components/ui/multi-select'
import {
  AssetDescription,
  AssetImportRequest,
  AssetSummary,
  AssetType,
  BoothAssetInfo,
  commands,
  FilterRequest,
  PreAvatar,
  PreAvatarWearable,
  PreWorldObject,
  Result,
} from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'

export const getTagCandidates = async (
  type: AssetType,
  allowedIds: string[] | null,
): Promise<Option[]> => {
  const result = await commands.getAssetTags(type, allowedIds)

  if (result.status === 'error') {
    return []
  }

  return result.data.map((tag) => ({
    label: tag.value,
    value: tag.value,
    priority: tag.priority,
  }))
}

export const getCategoryCandidates = async (
  type: Omit<AssetType, 'Avatar'>,
  allowedIds: string[] | null,
): Promise<Option[]> => {
  let result

  if (type === 'AvatarWearable') {
    result = await commands.getAvatarWearableCategories(allowedIds)
  } else if (type === 'WorldObject') {
    result = await commands.getWorldObjectCategories(allowedIds)
  } else {
    return []
  }

  if (result.status === 'error') {
    return []
  }

  return result.data.map((category) => ({
    label: category.value,
    value: category.value,
    priority: category.priority,
  }))
}

export const getSupportedAvatarCandidates = async (
  allowedIds: string[] | null,
): Promise<Option[]> => {
  const result = await commands.getAllSupportedAvatarValues(allowedIds)

  if (result.status === 'error') {
    return []
  }

  return result.data.map((avatar) => ({
    label: avatar.value,
    value: avatar.value,
    priority: avatar.priority,
  }))
}

export const openFileOrDirSelector = async (
  type: 'file' | 'directory',
): Promise<string[] | null> => {
  return await open({
    directory: type === 'directory',
    multiple: true,
  })
}

export const fetchBoothInformation = async (
  boothItemId: number,
): Promise<Result<BoothAssetInfo, string>> => {
  return await commands.getAssetInfoFromBooth(boothItemId)
}

export const getAssetSummariesByBoothId = async (
  boothItemId: number,
): Promise<Result<AssetSummary[], string>> => {
  return await commands.getAssetDisplaysByBoothId(boothItemId)
}

export const downloadImageFromUrl = async (
  url: string,
): Promise<Result<string, string>> => {
  return await commands.resolvePximgFilename(url)
}

export const resolveImageAbsolutePath = async (
  filename: string,
): Promise<Result<string, string>> => {
  return await commands.getImageAbsolutePath(filename)
}

export const openAssetManagedDir = async (assetId: string): Promise<void> => {
  const result = await commands.openManagedDir(assetId)

  if (result.status === 'error') {
    console.error(result.error)
  }
}

export const searchAssetsByText = async (
  text: string,
): Promise<Result<string[], string>> => {
  const req: FilterRequest = {
    assetType: null,
    queryText: text,
    categories: null,
    tags: null,
    tagMatchType: 'OR',
    supportedAvatars: null,
    supportedAvatarMatchType: 'OR',
  }

  return await commands.getFilteredAssetIds(req)
}

export const getNonExistentPaths = async (
  paths: string[],
): Promise<Result<string[], string>> => {
  return await commands.extractNonExistentPaths(paths)
}

export const submit = async (
  data: AssetSubmissionData,
  deleteSource: boolean,
): Promise<string | null> => {
  const preAsset = createPreAsset({
    assetType: data.type.value,
    description: {
      name: data.name.value,
      creator: data.creator.value,
      imageFilename: data.image.value,
      memo: data.assetMemo.value,
      tags: data.tags.value,
      dependencies: data.assetDependencies.value,
      boothItemId: null, // TODO: BOOTH item id を保持する
      createdAt: 0,
      publishedAt: null,
    },
    category: data.category.value ?? undefined,
    supportedAvatars: data.supportedAvatars.value,
  })

  if (preAsset.status === 'error') {
    console.error(preAsset.error)
    return null
  }

  const result = await sendAssetImportRequest(
    data.type.value,
    data.items.value,
    preAsset.data,
    deleteSource,
  )

  if (result.status === 'error') {
    console.error(result.error)
    return null
  }

  return result.data
}

type CreatePreAssetProps = {
  assetType: AssetType
  description: AssetDescription
  category?: string
  supportedAvatars?: string[]
}

const createPreAsset = ({
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

const sendAssetImportRequest = async (
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
  } else {
    return { status: 'error', error: `Unsupported asset type: ${assetType}` }
  }
}
