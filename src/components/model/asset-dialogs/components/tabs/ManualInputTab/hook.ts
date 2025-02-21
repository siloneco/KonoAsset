import { useState, useContext } from 'react'
import { AssetFormType } from '@/lib/form'
import { AssetType } from '@/lib/bindings'
import { PreferenceContext } from '@/components/context/PreferenceContext'

export type Props = {
  form: AssetFormType
}

type ReturnProps = {
  assetType: AssetType
  imageFilename: string | null
  setImageFilename: (path: string | null) => void
  imageUrlIndex: number
  setImageUrlIndex: (index: number) => void
  deleteSourceChecked: boolean
  setDeleteSourceChecked: (checked: boolean) => void
}

export const useManualInputTabHooks = ({ form }: Props): ReturnProps => {
  const [imageUrlIndex, setImageUrlIndex] = useState(0)
  const { preference, setPreference } = useContext(PreferenceContext)

  return {
    assetType: form.watch('assetType'),
    imageFilename: form.watch('imageFilename'),
    setImageFilename: (path: string | null) =>
      form.setValue('imageFilename', path),
    imageUrlIndex,
    setImageUrlIndex,
    deleteSourceChecked: preference.deleteOnImport,
    setDeleteSourceChecked: (checked: boolean) =>
      setPreference({ ...preference, deleteOnImport: checked }, true),
  }
}
