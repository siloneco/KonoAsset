import { Option } from '@/components/ui/multi-select'

import { useState, useEffect, useContext } from 'react'
import { fetchAllCategories, fetchAllSupportedAvatars } from './logic'
import MultiFilterItemSelector from '@/components/model/MainSidebar/components/MultiFilterItemSelector'
import { PersistentContext } from '@/components/context/PersistentContext'
import { useLocalization } from '@/hooks/use-localization'

const AllTypeFilter = () => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const { t } = useLocalization()

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
        label={t('general:category')}
        placeholder={t('mainsidebar:filter:category:placeholder')}
        candidates={categoryCandidates}
        value={categoryValues}
        onValueChange={(values) =>
          setCategoryFilter(values.map((v) => v.value))
        }
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
      />
    </div>
  )
}

export default AllTypeFilter
