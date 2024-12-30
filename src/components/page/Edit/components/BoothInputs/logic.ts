import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import console from 'console'

type Props = {
  id: number
  form: AssetFormType
}
export const getAssetDescriptionFromBooth = async ({ id, form }: Props) => {
  const result = await commands.getAssetDescriptionFromBooth(id)

  if (result.status === 'error') {
    console.error(result.error)
    return
  }

  const description = result.data.description
  form.setValue('name', description.name)
  form.setValue('creator', description.creator)
  form.setValue('imageFilename', description.imageFilename)
  form.setValue('publishedAt', description.publishedAt)
}
