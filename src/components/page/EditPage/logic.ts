import { Option } from '@/components/ui/multi-select'
import {
  AssetType,
  AvatarAsset,
  GetAssetResult,
  SimpleResult,
} from '@/lib/entity'
import { isBoothURL } from '@/lib/utils'
import { invoke } from '@tauri-apps/api/core'
import { UseFormReturn } from 'react-hook-form'

type UpdateAssetProps = {
  id: string
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      tags: string[]
      booth_url: string | null
      category: string
      supportedAvatars: string[]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
}

export const updateAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<SimpleResult> => {
  const assetType: AssetType = form.getValues('assetType')

  if (assetType === AssetType.Avatar) {
    return await updateAvatarAsset({ id, form })
  } else if (assetType === AssetType.AvatarRelated) {
    return await updateAvatarRelatedAsset({ id, form })
  } else if (assetType === AssetType.World) {
    return await updateWorldAsset({ id, form })
  }

  return { success: false, error_message: 'Invalid asset type' }
}

const updateAvatarAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<SimpleResult> => {
  const title = form.getValues('title')
  const author = form.getValues('author')
  const image_src = form.getValues('image_src')
  const tags = form.getValues('tags')

  let booth_url = form.getValues('booth_url')
  if (booth_url !== null && !isBoothURL(booth_url)) {
    booth_url = null
  }

  const asset: AvatarAsset = {
    id,
    description: {
      title,
      author,
      image_src,
      booth_url,
      tags,
      created_at: 0, // unused on updating
    },
  }

  const result: SimpleResult = await invoke('update_avatar_asset', { asset })
  return result
}

const updateAvatarRelatedAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<SimpleResult> => {
  const title = form.getValues('title')
  const author = form.getValues('author')
  const image_src = form.getValues('image_src')
  const tags = form.getValues('tags')
  const category = form.getValues('category')
  const supportedAvatars = form.getValues('supportedAvatars')

  let booth_url = form.getValues('booth_url')
  if (booth_url !== null && !isBoothURL(booth_url)) {
    booth_url = null
  }

  const asset = {
    id,
    description: {
      title,
      author,
      image_src,
      booth_url,
      tags,
      created_at: 0, // unused on updating
    },
    category,
    supported_avatars: supportedAvatars,
  }

  const result: SimpleResult = await invoke('update_avatar_related_asset', {
    asset,
  })
  return result
}

const updateWorldAsset = async ({
  id,
  form,
}: UpdateAssetProps): Promise<SimpleResult> => {
  const title = form.getValues('title')
  const author = form.getValues('author')
  const image_src = form.getValues('image_src')
  const tags = form.getValues('tags')
  const category = form.getValues('category')

  let booth_url = form.getValues('booth_url')
  if (booth_url !== null && !isBoothURL(booth_url)) {
    booth_url = null
  }

  const asset = {
    id,
    description: {
      title,
      author,
      image_src,
      booth_url,
      tags,
      created_at: 0, // unused on updating
    },
    category,
  }

  const result: SimpleResult = await invoke('update_world_asset', { asset })
  return result
}

export const fetchSupportedAvatars = async (): Promise<Option[]> => {
  const result: string[] = await invoke('get_all_supported_avatar_values')

  const options = result.map((value) => {
    return { label: value, value }
  })

  return options
}

export const fetchAvatarRelatedCategoryCandidates = async () => {
  const result: string[] = await invoke('get_avatar_related_categories')
  return result
}

export const fetchWorldCategoryCandidates = async () => {
  const result: string[] = await invoke('get_world_categories')
  return result
}

export const fetchAssetInformation = async (
  id: string,
): Promise<GetAssetResult> => {
  return (await invoke('get_asset', { id })) as GetAssetResult
}
