import { Option } from '@/components/ui/multi-select'
import {
  AssetType,
  Avatar,
  AvatarWearable,
  commands,
  GetAssetResult,
  Result,
  WorldObject,
} from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'

type UpdateAssetProps = {
  id: string
  form: AssetFormType
}

export const updateAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<Result<boolean, string>> => {
  const assetType: AssetType = form.getValues('assetType')

  if (assetType === 'Avatar') {
    return await updateAvatar({ id, form })
  } else if (assetType === 'AvatarWearable') {
    return await updateAvatarWearable({ id, form })
  } else if (assetType === 'WorldObject') {
    return await updateWorldObject({ id, form })
  }

  return { status: 'error', error: 'Invalid asset type' }
}

const updateAvatar = async ({
  id,
  form,
}: UpdateAssetProps): Promise<Result<boolean, string>> => {
  const name = form.getValues('name')
  const creator = form.getValues('creator')
  const imageFilename = form.getValues('imageFilename')
  const boothItemId = form.getValues('boothItemId')
  const tags = form.getValues('tags')
  const publishedAt = form.getValues('publishedAt')

  const asset: Avatar = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      createdAt: 0, // unused on updating
      publishedAt,
    },
  }

  return await commands.updateAvatar(asset)
}

const updateAvatarWearable = async ({
  id,
  form,
}: UpdateAssetProps): Promise<Result<boolean, string>> => {
  const name = form.getValues('name')
  const creator = form.getValues('creator')
  const imageFilename = form.getValues('imageFilename')
  const boothItemId = form.getValues('boothItemId')
  const tags = form.getValues('tags')
  const category = form.getValues('category')
  const supportedAvatars = form.getValues('supportedAvatars')
  const publishedAt = form.getValues('publishedAt')

  const asset: AvatarWearable = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      createdAt: 0, // unused on updating
      publishedAt,
    },
    category,
    supportedAvatars,
  }

  return await commands.updateAvatarWearable(asset)
}

const updateWorldObject = async ({
  id,
  form,
}: UpdateAssetProps): Promise<Result<boolean, string>> => {
  const name = form.getValues('name')
  const creator = form.getValues('creator')
  const imageFilename = form.getValues('imageFilename')
  const boothItemId = form.getValues('boothItemId')
  const tags = form.getValues('tags')
  const category = form.getValues('category')
  const publishedAt = form.getValues('publishedAt')

  const asset: WorldObject = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      createdAt: 0, // unused on updating
      publishedAt,
    },
    category,
  }

  return await commands.updateWorldObject(asset)
}

export const fetchSupportedAvatars = async (): Promise<Option[]> => {
  const result = await commands.getAllSupportedAvatarValues()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  const options = result.data.map((value) => {
    return { label: value, value }
  })

  return options
}

export const fetchAvatarWearableCategoryCandidates = async (): Promise<
  string[]
> => {
  const result = await commands.getAvatarWearableCategories()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data
}

export const fetchWorldObjectCategoryCandidates = async (): Promise<
  string[]
> => {
  const result = await commands.getWorldObjectCategories()

  if (result.status === 'error') {
    console.error(result.error)
    return []
  }

  return result.data
}

export const fetchAssetInformation = async (
  id: string,
): Promise<Result<GetAssetResult, string>> => {
  const result = await commands.getAsset(id)
  return result
}
