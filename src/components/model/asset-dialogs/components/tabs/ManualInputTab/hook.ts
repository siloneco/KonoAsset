import { useEffect, useState } from 'react'
import { AssetFormType } from '@/lib/form'
import { AssetType, commands } from '@/lib/bindings'
import { Option as TextInputSelectOption } from '@/components/ui/text-input-select'

export type Props = {
  form: AssetFormType
}

type ReturnProps = {
  assetType: AssetType
  imageFilename: string | null
  setImageFilename: (path: string | null) => void
  imageUrlIndex: number
  setImageUrlIndex: (index: number) => void
  creatorCandidates: TextInputSelectOption[]
}

export const useManualInputTabHooks = ({ form }: Props): ReturnProps => {
  const [imageUrlIndex, setImageUrlIndex] = useState(0)
  const [creatorCandidates, setCreatorCandidates] = useState<
    TextInputSelectOption[]
  >([])

  useEffect(() => {
    const fetchCreatorCandidates = async () => {
      const result = await commands.getCreatorNames(null)

      if (result.status === 'error') {
        console.error(result.error)
        return
      }

      setCreatorCandidates(result.data)
    }

    fetchCreatorCandidates()
  }, [])

  return {
    assetType: form.watch('assetType'),
    imageFilename: form.watch('imageFilename'),
    setImageFilename: (path: string | null) =>
      form.setValue('imageFilename', path),
    imageUrlIndex,
    setImageUrlIndex,
    creatorCandidates,
  }
}
