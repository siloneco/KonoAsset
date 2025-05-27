import { Option } from '@/components/ui/multi-select'
import { AssetType } from '@/lib/bindings'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  category: string | null
  tags: string[]
  fetchCategoryCandidates: (
    type: Omit<AssetType, 'Avatar'>,
  ) => Promise<Option[]>
  fetchTagCandidates: (type: AssetType) => Promise<Option[]>
}

type ReturnProps = {
  categoryOptionValue: Option | null
  categoryCandidates: Option[]
  tagOptionValues: Option[]
  tagCandidates: Option[]
}

export const useWorldObjectLayout = ({
  category,
  tags,
  fetchCategoryCandidates,
  fetchTagCandidates,
}: Props): ReturnProps => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  useEffect(() => {
    fetchCategoryCandidates('WorldObject').then(setCategoryCandidates)
    fetchTagCandidates('WorldObject').then(setTagCandidates)
  }, [fetchCategoryCandidates, fetchTagCandidates])

  const categoryOptionValue = useMemo(() => {
    if (category === null) {
      return null
    }

    return {
      value: category,
      label: category,
    }
  }, [category])

  const tagOptionValues = useMemo(() => {
    return tags.map((tag) => ({
      value: tag,
      label: tag,
    }))
  }, [tags])

  return {
    categoryOptionValue,
    categoryCandidates,
    tagOptionValues,
    tagCandidates,
  }
}
