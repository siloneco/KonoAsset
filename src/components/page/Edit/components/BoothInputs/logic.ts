import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'

type Props = {
  id: number
  form: AssetFormType
  setImageUrls: (urls: string[]) => void
}

export const getAssetInfoFromBooth = async ({
  id,
  form,
  setImageUrls,
}: Props) => {
  const result = await commands.getAssetInfoFromBooth(id)

  if (result.status === 'error') {
    console.error(result.error)
    return
  }

  const data = result.data
  form.setValue('name', data.name)
  form.setValue('creator', data.creator)
  form.setValue('publishedAt', data.publishedAt)

  setImageUrls(data.imageUrls)

  if (data.imageUrls.length > 0) {
    const imageResolveResult = await commands.resolvePximgFilename(
      data.imageUrls[0],
    )

    if (imageResolveResult.status === 'ok') {
      form.setValue('imageFilename', imageResolveResult.data)
    }
  }
}
