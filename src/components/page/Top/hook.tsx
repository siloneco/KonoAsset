import { AssetContextType } from '@/components/context/AssetContext'
import { useState, useEffect, useContext } from 'react'
import {
  checkForUpdate,
  dismissUpdate,
  downloadUpdate,
  onFileDrop,
  refreshAssets,
} from './logic'
import { useToast } from '@/hooks/use-toast'
import { buttonVariants } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary } from '@/lib/bindings'
import { useLocalization } from '@/hooks/use-localization'
import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'

type ReturnProps = {
  assetContextValue: AssetContextType
  isDragAndHover: boolean
  showingAssetCount: number
  setShowingAssetCount: (count: number) => void
  addAssetDialogOpen: boolean
  setAddAssetDialogOpen: (open: boolean) => void
  setEditAssetDialogAssetId: (assetId: string | null) => void
  setEditAssetDialogOpen: (open: boolean) => void
  editAssetDialogAssetId: string | null
  editAssetDialogOpen: boolean
  updateDialogOpen: boolean
  setUpdateDialogOpen: (open: boolean) => void
  dataManagementDialogAssetId: string | null
  dataManagementDialogOpen: boolean
  setDataManagementDialogOpen: (open: boolean) => void
  openDataManagementDialog: (assetId: string) => void
  updateDownloadTaskId: string | null
}

export const useTopPage = (): ReturnProps => {
  const { sortBy } = useContext(PersistentContext)
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetSummary[]
  >([])
  const [addAssetDialogOpen, setAddAssetDialogOpen] = useState(false)

  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)
  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [updateDownloadTaskId, setUpdateDownloadTaskId] = useState<
    string | null
  >(null)

  const [dataManagementDialogOpen, setDataManagementDialogOpen] =
    useState(false)
  const [dataManagementDialogAssetId, setDataManagementDialogAssetId] =
    useState<string | null>(null)

  const [showingAssetCount, setShowingAssetCount] = useState(0)

  const [isDragAndHover, setDragAndHover] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  const { register } = useContext(DragDropContext)

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

  useEffect(() => {
    const config: DragDropRegisterConfig = {
      uniqueId: 'top-page',
      priority: 0,
    }

    register(config, async (event) => {
      onFileDrop(event, setDragAndHover)
      return false
    })
  }, [])

  const startUpdateDownloadingAndOpenDialog = async () => {
    await downloadUpdate(setUpdateDownloadTaskId)
    setUpdateDialogOpen(true)
  }

  const executeUpdateCheck = async () => {
    const updateAvailable = await checkForUpdate()

    if (!updateAvailable) {
      return
    }

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
            altText="Open update dialog"
            className={buttonVariants({ variant: 'default' })}
            onClick={startUpdateDownloadingAndOpenDialog}
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

  useEffect(() => {
    executeUpdateCheck()
  }, [])

  const openDataManagementDialog = (assetId: string) => {
    setDataManagementDialogAssetId(assetId)
    setDataManagementDialogOpen(true)
  }

  return {
    assetContextValue,
    isDragAndHover,
    showingAssetCount,
    setShowingAssetCount,
    addAssetDialogOpen,
    setAddAssetDialogOpen,
    setEditAssetDialogAssetId,
    setEditAssetDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
    updateDialogOpen,
    setUpdateDialogOpen,
    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    setDataManagementDialogOpen,
    openDataManagementDialog,
    updateDownloadTaskId,
  }
}
