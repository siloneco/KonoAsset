import { AssetContextType } from '@/components/context/AssetContext'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useState, useEffect, useContext } from 'react'
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
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'

type ReturnProps = {
  assetContextValue: AssetContextType
  isDragAndHover: boolean
}

export const useTopPage = (): ReturnProps => {
  const { sortBy } = useContext(PersistentContext)
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetSummary[]
  >([])

  const [isDragAndHover, setDragAndHover] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  const assetContextValue: AssetContextType = {
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
        title: t('top:new-update-toast'),
        description: t('top:new-update-toast:description'),
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
              {t('top:new-update-toast:button')}
            </ToastAction>
            <ToastAction
              altText="Ignore update"
              className={buttonVariants({ variant: 'outline' })}
              onClick={() => dismissUpdate()}
            >
              {t('top:new-update-toast:close')}
            </ToastAction>
          </div>
        ),
      })
    }
  }

  useEffect(() => {
    executeUpdateCheck()
  }, [])

  return { assetContextValue, isDragAndHover }
}
