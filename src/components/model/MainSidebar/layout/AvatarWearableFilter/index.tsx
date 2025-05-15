import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import {
  fetchAllSupportedAvatars,
  fetchAvatarWearableCategories,
} from './logic'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'
import { AssetContext } from '@/components/context/AssetContext'

const AvatarWearableFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)
  const [isSupportedAvatarFocused, setIsSupportedAvatarFocused] =
    useState(false)
  const { t } = useLocalization()

  const { assetDisplaySortedList, filteredIds } = useContext(AssetContext)
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
    if (!isCategoryFocused) {
      setCategoryCandidates(await fetchAvatarWearableCategories(filteredIds))
    }
    if (!isSupportedAvatarFocused) {
      setSupportedAvatarCandidates(await fetchAllSupportedAvatars(filteredIds))
    }
  }

  useEffect(() => {
    updateCandidates()
  }, [
    assetDisplaySortedList,
    filteredIds,
    isCategoryFocused,
    isSupportedAvatarFocused,
  ])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
        inputProps={{
          onFocus: () => setIsCategoryFocused(true),
          onBlur: () => setIsCategoryFocused(false),
        }}
      />
      <MultiFilterItemSelector
        label={t('general:supported-avatars')}
        placeholder={t(
          'mainsidebar:avatar-wearable-filter:supported-avatars:placeholder',
        )}
        candidates={supportedAvatarCandidates}
        value={supportedAvatarValues}
        onValueChange={(values) =>
          setSupportedAvatarFilter(values.map((v) => v.value))
        }
        matchType={supportedAvatarFilterMatchType}
        setMatchType={setSupportedAvatarFilterMatchType}
        inputProps={{
          onFocus: () => setIsSupportedAvatarFocused(true),
          onBlur: () => setIsSupportedAvatarFocused(false),
        }}
      />
    </div>
  )
}

export default AvatarWearableFilter
