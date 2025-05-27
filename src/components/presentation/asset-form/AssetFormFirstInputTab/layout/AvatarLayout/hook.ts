import { Option } from '@/components/ui/multi-select'
import { AssetType } from '@/lib/bindings'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  tags: string[]
  fetchTagCandidates: (type: AssetType) => Promise<Option[]>
}

type ReturnProps = {
  tagOptionValues: Option[]
  tagCandidates: Option[]
}

export const useAvatarLayout = ({
  tags,
  fetchTagCandidates,
}: Props): ReturnProps => {
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  useEffect(() => {
    fetchTagCandidates('Avatar').then(setTagCandidates)
  }, [fetchTagCandidates])

  const tagOptionValues = useMemo(() => {
    return tags.map((tag) => {
      return {
        label: tag,
        value: tag,
      }
    })
  }, [tags])

  return {
    tagOptionValues,
    tagCandidates,
  }
}
