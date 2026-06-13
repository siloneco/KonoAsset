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
  creatorCandidates: TextInputSelectOption[]
}

export const useManualInputTabHooks = ({ form }: Props): ReturnProps => {
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
    creatorCandidates,
  }
}
