import { AssetContextType } from '@/components/context/AssetContext'
import { AssetFilterContextType } from '@/components/context/AssetFilterContext'
import { AssetType, MatchType, SortBy, AssetDisplay } from '@/lib/entity'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useState, useEffect } from 'react'
import {
  checkForUpdate,
  dismissUpdate,
  executeUpdate,
  onFileDrop,
  refreshAssets,
} from './logic'
import { useToast } from '@/hooks/use-toast'
import { buttonVariants } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'

type ReturnProps = {
  assetContextValue: AssetContextType
  filterContextValue: AssetFilterContextType
  isDragAndHover: boolean
}

export const useTopPage = (): ReturnProps => {
  const [textFilter, setTextFilter] = useState('')
  const [assetType, setAssetType] = useState<AssetType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [supportedAvatarFilter, setSupportedAvatarFilter] = useState<string[]>(
    [],
  )

  const [tagFilterMatchType, setTagFilterMatchType] = useState(MatchType.OR)
  const [supportedAvatarFilterMatchType, setSupportedAvatarFilterMatchType] =
    useState(MatchType.OR)

  const [sortBy, setSortBy] = useState<SortBy>(SortBy.CreatedAt)
  const [reverseOrder, setReverseOrder] = useState(true)
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetDisplay[]
  >([])

  const [isDragAndHover, setDragAndHover] = useState(false)

  const { toast } = useToast()

  const assetContextValue: AssetContextType = {
    sortBy: sortBy,
    setSortBy: setSortBy,
    reverseOrder: reverseOrder,
    setReverseOrder: setReverseOrder,

    assetDisplaySortedList: assetDisplaySortedList,
    setAssetDisplaySortedList: setAssetDisplaySortedList,

    deleteAssetById: async (id: string) => {
      setAssetDisplaySortedList((prev) =>
        prev.filter((asset) => asset.id !== id),
      )
    },

    refreshAssets: async () => {
      refreshAssets(sortBy, setAssetDisplaySortedList)
    },
  }

  const filterContextValue: AssetFilterContextType = {
    textFilter: textFilter,
    setTextFilter: setTextFilter,

    assetType: assetType,
    setAssetType: setAssetType,

    categoryFilter,
    setCategoryFilter,

    tagFilter,
    setTagFilter,
    tagFilterMatchType,
    setTagFilterMatchType,

    supportedAvatarFilter,
    setSupportedAvatarFilter,
    supportedAvatarFilterMatchType,
    setSupportedAvatarFilterMatchType,
  }

  useEffect(() => {
    assetContextValue.refreshAssets()
  }, [sortBy])

  getCurrentWindow().onDragDropEvent((event) => {
    onFileDrop(event, setDragAndHover)
  })

  const executeUpdateCheck = async () => {
    const updateAvailable = await checkForUpdate()

    if (updateAvailable) {
      toast({
        title: '新しいアップデートがあります！',
        description: 'アップデートにはバグ修正、機能追加などが含まれます',
        duration: 30000,
        onSwipeEnd: () => {
          dismissUpdate()
        },
        action: (
          <div className="flex flex-col space-y-2">
            <ToastAction
              altText="Ignore update"
              className={buttonVariants({ variant: 'default' })}
              onClick={executeUpdate}
            >
              アップデートする
            </ToastAction>
            <ToastAction
              altText="Ignore update"
              className={buttonVariants({ variant: 'outline' })}
              onClick={() => dismissUpdate()}
            >
              今はしない
            </ToastAction>
          </div>
        ),
      })
    }
  }

  useEffect(() => {
    executeUpdateCheck()
  }, [])

  return { assetContextValue, filterContextValue, isDragAndHover }
}
