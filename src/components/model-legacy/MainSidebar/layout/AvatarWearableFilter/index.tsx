import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchAllSupportedAvatars,
  fetchAvatarWearableCategories,
} from './logic'
import { MultiFilterItemSelector } from '@/components/model-legacy/MainSidebar/components/MultiFilterItemSelector'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryViewStore } from '@/stores/AssetSummaryViewStore'
import { useShallow } from 'zustand/react/shallow'
import { useAssetFilterStore } from '@/stores/AssetFilterStore'

export const AvatarWearableFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)
  const [isSupportedAvatarFocused, setIsSupportedAvatarFocused] =
    useState(false)
  const { t } = useLocalization()

  const { filteredIds, filters, updateFilter } = useAssetFilterStore(
    useShallow((state) => ({
      filteredIds: state.filteredIds,
      filters: state.filters,
      updateFilter: state.updateFilter,
    })),
  )

  const sortedAssetSummaries = useAssetSummaryViewStore(
    (state) => state.sortedAssetSummaries,
  )

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
  }, [sortedAssetSummaries, updateCandidates])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={filters.category}
        onValueChange={(value) =>
          updateFilter({
            category: value,
          })
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
        value={filters.supportedAvatar.filters}
        onValueChange={(value) =>
          updateFilter({
            supportedAvatar: {
              filters: value,
            },
          })
        }
        matchType={filters.supportedAvatar.type}
        setMatchType={(type) => updateFilter({ supportedAvatar: { type } })}
        inputProps={{
          onFocus: () => setIsSupportedAvatarFocused(true),
          onBlur: () => setIsSupportedAvatarFocused(false),
        }}
      />
    </div>
  )
}
