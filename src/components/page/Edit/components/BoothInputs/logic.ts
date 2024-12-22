import { FetchAssetDescriptionFromBoothResult } from '@/lib/entity'
import { AssetFormType } from '@/lib/form'
import { invoke } from '@tauri-apps/api/core'
import console from 'console'

type Props = {
  id: number
  form: AssetFormType
}
export const getAssetDescriptionFromBooth = async ({ id, form }: Props) => {
  const result: FetchAssetDescriptionFromBoothResult = await invoke(
    'get_asset_description_from_booth',
    { boothItemId: id },
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
