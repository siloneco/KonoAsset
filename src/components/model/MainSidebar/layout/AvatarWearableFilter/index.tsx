import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext, useCallback } from 'react'
import {
  fetchAllSupportedAvatars,
  fetchAvatarWearableCategories,
} from './logic'
import { MultiFilterItemSelector } from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'
import { AssetContext } from '@/components/context/AssetContext'

export const AvatarWearableFilter = () => {
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

  const updateCandidates = useCallback(async () => {
    if (!isCategoryFocused) {
      setCategoryCandidates(await fetchAvatarWearableCategories(filteredIds))
    }
    if (!isSupportedAvatarFocused) {
      setSupportedAvatarCandidates(await fetchAllSupportedAvatars(filteredIds))
    }
  }, [filteredIds, isCategoryFocused, isSupportedAvatarFocused])

  useEffect(() => {
    updateCandidates()
  }, [assetDisplaySortedList, updateCandidates])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryFilter}
        onValueChange={setCategoryFilter}
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
        value={supportedAvatarFilter}
        onValueChange={setSupportedAvatarFilter}
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
