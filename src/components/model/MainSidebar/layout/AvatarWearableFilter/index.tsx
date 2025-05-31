import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext, useCallback } from 'react'
import {
  fetchAllSupportedAvatars,
  fetchAvatarWearableCategories,
} from './logic'
import { MultiFilterItemSelector } from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext'

export const AvatarWearableFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [isCategoryFocused, setIsCategoryFocused] = useState(false)
  const [isSupportedAvatarFocused, setIsSupportedAvatarFocused] =
    useState(false)
  const { t } = useLocalization()

  const { sortedAssetSummaries } = useAssetSummaryStore()
  const {
    matchedAssetIds,
    categoryFilter,
    supportedAvatarFilter,
    supportedAvatarFilterMatchType,
    updateFilter,
  } = useContext(AssetFilterContext)

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

  const updateCandidates = useCallback(async () => {
    if (!isCategoryFocused) {
      setCategoryCandidates(
        await fetchAvatarWearableCategories(matchedAssetIds),
      )
    }
    if (!isSupportedAvatarFocused) {
      setSupportedAvatarCandidates(
        await fetchAllSupportedAvatars(matchedAssetIds),
      )
    }
  }, [matchedAssetIds, isCategoryFocused, isSupportedAvatarFocused])

  useEffect(() => {
    updateCandidates()
  }, [sortedAssetSummaries, updateCandidates])

  return (
    <div className="mt-4 space-y-4">
      <MultiFilterItemSelector
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          updateFilter({ categoryFilter: values.map((v) => v.value) })
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
          updateFilter({
            supportedAvatarFilter: values.map((v) => v.value),
          })
        }
        matchType={supportedAvatarFilterMatchType}
        setMatchType={(matchType) =>
          updateFilter({ supportedAvatarFilterMatchType: matchType })
        }
        inputProps={{
          onFocus: () => setIsSupportedAvatarFocused(true),
          onBlur: () => setIsSupportedAvatarFocused(false),
        }}
      />
    </div>
  )
}
