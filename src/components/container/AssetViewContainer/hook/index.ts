import { AssetContext } from '@/components/context/AssetContext'
import { PersistentContext } from '@/components/context/PersistentContext'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { AssetFilterContext } from '@/components/functional/AssetFilterContext/AssetFilterContext'
import { AssetView } from '@/components/presentation/asset-view/AssetView'
import { AssetType, commands } from '@/lib/bindings'
import { ComponentProps, useCallback, useContext, useMemo } from 'react'

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
  const { assetDisplaySortedList, deleteAssetById } = useContext(AssetContext)
  const { matchedAssetIds, updateFilter, clearFilters } =
    useContext(AssetFilterContext)
  const { assetCardSize } = useContext(PersistentContext)
  const { preference } = useContext(PreferenceContext)

  const sortedAndFilteredAssetSummaries = useMemo(() => {
    if (matchedAssetIds === null) {
      return assetDisplaySortedList
    } else {
      return assetDisplaySortedList.filter((asset) =>
        matchedAssetIds.includes(asset.id),
      )
    }
  }, [assetDisplaySortedList, matchedAssetIds])

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

      deleteAssetById(assetId)
    },
    [deleteAssetById],
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
    noAssetRegistered: assetDisplaySortedList.length === 0,
    clearAssetFilters: clearFilters,
    language: preference.language,
    onOpenManagedDirButtonClick,
    getAssetDirectoryPath: commands.getDirectoryPath,
    deleteAsset,
    setFilterAssetType,
    setCreatorNameFilter,
    resolveImageAbsolutePath: commands.getImageAbsolutePath,
  }
}
