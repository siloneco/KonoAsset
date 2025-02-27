import { useState } from 'react'
import { AssetFormType } from '@/lib/form'
import { AssetType } from '@/lib/bindings'

export type Props = {
  form: AssetFormType
}

type ReturnProps = {
  assetType: AssetType
  imageFilename: string | null
  setImageFilename: (path: string | null) => void
  imageUrlIndex: number
  setImageUrlIndex: (index: number) => void
}

export const useManualInputTabHooks = ({ form }: Props): ReturnProps => {
  const [imageUrlIndex, setImageUrlIndex] = useState(0)

  return {
    assetType: form.watch('assetType'),
    imageFilename: form.watch('imageFilename'),
    setImageFilename: (path: string | null) =>
      form.setValue('imageFilename', path),
    imageUrlIndex,
    setImageUrlIndex,
  }
}
