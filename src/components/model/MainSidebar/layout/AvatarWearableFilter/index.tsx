import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories, fetchAllSupportedAvatars } from './logic'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'

const AvatarWearableFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])

  const {
    categoryFilter,
    setCategoryFilter,
    supportedAvatarFilter,
    setSupportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,
  } = useContext(PersistentContext)

  const categoryValues: Option[] = categoryFilter.map((category) => ({
    value: category,
    label: category,
  }))
  const supportedAvatarValues: Option[] = supportedAvatarFilter.map(
    (avatar) => ({
      value: avatar,
      label: avatar,
    }),
  )

  const updateCandidates = async () => {
    setSupportedAvatarCandidates(await fetchAllSupportedAvatars())
    setCategoryCandidates(await fetchAllCategories())
  }

  useEffect(() => {
    updateCandidates()
  }, [])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label="カテゴリ"
        placeholder="絞り込むカテゴリを選択..."
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
      />
      <MultiFilterItemSelector
        label="対応アバター"
        placeholder="対応アバターを選択..."
        candidates={supportedAvatarCandidates}
        value={supportedAvatarValues}
        onValueChange={(values) =>
          setSupportedAvatarFilter(values.map((v) => v.value))
        }
        matchType={supportedAvatarFilterMatchType}
        setMatchType={setSupportedAvatarFilterMatchType}
      />
    </div>
  )
}

export default AvatarWearableFilter
