import {
  AssetDescription,
  FetchAssetDescriptionFromBoothResult,
} from '@/lib/entity'
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
    const description: AssetDescription =
      result.asset_description as AssetDescription
    form.setValue('title', description.title)
    form.setValue('author', description.author)
    form.setValue('image_src', description.image_src)
    form.setValue('published_at', description.published_at)
  } else {
    console.error(result.error_message)
  }
}
