import {
  AssetType,
  Avatar,
  AvatarWearable,
  commands,
  GetAssetResult,
  OtherAsset,
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
  } else if (assetType === 'OtherAsset') {
    return await updateOtherAsset({ id, form })
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
  const memo = form.getValues('memo')
  const dependencies = form.getValues('dependencies')
  const publishedAt = form.getValues('publishedAt')

  const avatar: Avatar = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      memo,
      dependencies,
      createdAt: 0, // unused on updating
      publishedAt,
    },
  }

  return await commands.updateAsset({ avatar })
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
  const memo = form.getValues('memo')
  const dependencies = form.getValues('dependencies')
  const category = form.getValues('category')
  const supportedAvatars = form.getValues('supportedAvatars')
  const publishedAt = form.getValues('publishedAt')

  const avatarWearable: AvatarWearable = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      memo,
      dependencies,
      createdAt: 0, // unused on updating
      publishedAt,
    },
    category,
    supportedAvatars,
  }

  return await commands.updateAsset({ avatarWearable })
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
  const memo = form.getValues('memo')
  const dependencies = form.getValues('dependencies')
  const category = form.getValues('category')
  const publishedAt = form.getValues('publishedAt')

  const worldObject: WorldObject = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      memo,
      dependencies,
      createdAt: 0, // unused on updating
      publishedAt,
    },
    category,
  }

  return await commands.updateAsset({ worldObject })
}

const updateOtherAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<Result<boolean, string>> => {
  const name = form.getValues('name')
  const creator = form.getValues('creator')
  const imageFilename = form.getValues('imageFilename')
  const boothItemId = form.getValues('boothItemId')
  const tags = form.getValues('tags')
  const memo = form.getValues('memo')
  const dependencies = form.getValues('dependencies')
  const category = form.getValues('category')
  const publishedAt = form.getValues('publishedAt')

  const otherAsset: OtherAsset = {
    id,
    description: {
      name,
      creator,
      imageFilename,
      boothItemId,
      tags,
      memo,
      dependencies,
      createdAt: 0, // unused on updating
      publishedAt,
    },
    category,
  }

  return await commands.updateAsset({ otherAsset })
}

export const fetchAssetInformation = async (
  id: string,
): Promise<Result<GetAssetResult, string>> => {
  const result = await commands.getAsset(id)
  return result
}
