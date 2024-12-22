import { FetchAssetDescriptionFromBoothResult } from '@/lib/entity'
import { AssetFormType } from '@/lib/form'
import { invoke } from '@tauri-apps/api/core'
import console from 'console'

type Props = {
  url: string
  form: AssetFormType
}
export const getAssetDescriptionFromBooth = async ({ url, form }: Props) => {
  const result: FetchAssetDescriptionFromBoothResult = await invoke(
    'get_asset_description_from_booth',
    { url },
  )

  if (result.success) {
    form.setValue('title', result.asset_description!.title)
    form.setValue('author', result.asset_description!.author)
    form.setValue('image_src', result.asset_description!.image_src)
    form.setValue('published_at', result.asset_description!.published_at)
  } else {
    console.error(result.error_message)
  }
}
