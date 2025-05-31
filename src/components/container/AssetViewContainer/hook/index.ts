import { PersistentContext } from '@/components/context/PersistentContext'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext/AssetFilterContext'
import { AssetView } from '@/components/presentation/asset-view/AssetView'
import { AssetType, commands } from '@/lib/bindings'
import {
  ComponentProps,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { resolveImageAbsolutePath } from '../logic'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'

type ReturnProps = Pick<
  ComponentProps<typeof AssetView>,
  | 'sortedAndFilteredAssetSummaries'
  | 'assetCardSize'
  | 'noAssetRegistered'
  | 'clearAssetFilters'
  | 'language'
  | 'onOpenManagedDirButtonClick'
  | 'getAssetDirectoryPath'
  | 'deleteAsset'
  | 'setFilterAssetType'
  | 'setCreatorNameFilter'
  | 'resolveImageAbsolutePath'
>

export const useAssetViewContainer = (): ReturnProps => {
  const {
    sortedAssetSummaries,
    deleteAssetSummaryFromFrontend,
    refreshAssetSummaries,
  } = useAssetSummaryStore()
  const { matchedAssetIds, updateFilter, clearFilters } =
    useContext(AssetFilterContext)
  const { assetCardSize } = useContext(PersistentContext)
  const { preference } = useContext(PreferenceContext)
  const { sortBy, reverseOrder } = useContext(PersistentContext)

  useEffect(() => {
    refreshAssetSummaries(sortBy)
  }, [refreshAssetSummaries, sortBy])

  const sortedAndFilteredAssetSummaries = useMemo(() => {
    const result = sortedAssetSummaries.filter(
      (asset) => matchedAssetIds === null || matchedAssetIds.includes(asset.id),
    )

    if (!reverseOrder) {
      return result
    } else {
      return result.reverse()
    }
  }, [sortedAssetSummaries, matchedAssetIds, reverseOrder])

  const onOpenManagedDirButtonClick = useCallback(async (assetId: string) => {
    const result = await commands.openManagedDir(assetId)

    if (result.status === 'error') {
      console.error(result.error)
    }
  }, [])

  const deleteAsset = useCallback(
    async (assetId: string) => {
      const result = await commands.requestAssetDeletion(assetId)

      if (result.status === 'error') {
        console.error(result.error)
        return
      }

      deleteAssetSummaryFromFrontend(assetId)
    },
    [deleteAssetSummaryFromFrontend],
  )

  const setFilterAssetType = useCallback(
    (assetType: AssetType) => {
      updateFilter({
        assetType,
      })
    },
    [updateFilter],
  )

  const setCreatorNameFilter = useCallback(
    (creatorName: string) => {
      updateFilter({
        queryTextMode: 'advanced',
        queryTextFilterForCreator: creatorName,
      })
    },
    [updateFilter],
  )

  return {
    sortedAndFilteredAssetSummaries,
    assetCardSize,
    noAssetRegistered: sortedAssetSummaries.length === 0,
    clearAssetFilters: clearFilters,
    language: preference.language,
    onOpenManagedDirButtonClick,
    getAssetDirectoryPath: commands.getDirectoryPath,
    deleteAsset,
    setFilterAssetType,
    setCreatorNameFilter,
    resolveImageAbsolutePath,
  }
}
