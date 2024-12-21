import { FetchAssetDescriptionFromBoothResult, AssetType } from '@/lib/entity'
import { invoke } from '@tauri-apps/api/core'
import console from 'console'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  url: string
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      booth_url: string | null
      tags: string[]
      category: string
      supportedAvatars: string[]
      published_at: number | null
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
}
export const getAssetDescriptionFromBooth = async ({ url, form }: Props) => {
  const result: FetchAssetDescriptionFromBoothResult = await invoke(
    'get_asset_description_from_booth',
    { url },
  )

  if (result.success) {
    form?.setValue('title', result.asset_description!.title)
    form?.setValue('author', result.asset_description!.author)
    form?.setValue('image_src', result.asset_description!.image_src)
    form?.setValue('published_at', result.asset_description!.published_at)
  } else {
    console.error(result.error_message)
  }
}
