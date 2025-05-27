import { Option } from '@/components/ui/multi-select'
import { AssetType } from '@/lib/bindings'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  category: string | null
  supportedAvatars: string[]
  tags: string[]
  fetchCategoryCandidates: (
    type: Omit<AssetType, 'Avatar'>,
  ) => Promise<Option[]>
  fetchSupportedAvatarCandidates: () => Promise<Option[]>
  fetchTagCandidates: (type: AssetType) => Promise<Option[]>
}

type ReturnProps = {
  categoryOptionValue: Option | null
  categoryCandidates: Option[]
  supportedAvatarOptionValues: Option[]
  supportedAvatarCandidates: Option[]
  tagOptionValues: Option[]
  tagCandidates: Option[]
}

export const useAvatarWearableLayout = ({
  category,
  supportedAvatars,
  tags,
  fetchCategoryCandidates,
  fetchSupportedAvatarCandidates,
  fetchTagCandidates,
}: Props): ReturnProps => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  useEffect(() => {
    fetchCategoryCandidates('AvatarWearable').then(setCategoryCandidates)
    fetchSupportedAvatarCandidates().then(setSupportedAvatarCandidates)
    fetchTagCandidates('AvatarWearable').then(setTagCandidates)
  }, [
    fetchCategoryCandidates,
    fetchSupportedAvatarCandidates,
    fetchTagCandidates,
  ])

  const categoryOptionValue = useMemo(() => {
    if (category === null) {
      return null
    }

    return {
      value: category,
      label: category,
    }
  }, [category])

  const supportedAvatarOptionValues = useMemo(() => {
    return supportedAvatars.map((avatar) => ({
      value: avatar,
      label: avatar,
    }))
  }, [supportedAvatars])

  const tagOptionValues = useMemo(() => {
    return tags.map((tag) => ({
      value: tag,
      label: tag,
    }))
  }, [tags])

  return {
    categoryOptionValue,
    categoryCandidates,
    supportedAvatarOptionValues,
    supportedAvatarCandidates,
    tagOptionValues,
    tagCandidates,
  }
}
