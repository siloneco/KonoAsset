import { AssetContextType } from '@/components/context/AssetContext'
import { useState, useEffect, useContext } from 'react'
import { onFileDrop, refreshAssets } from './logic'
import { PersistentContext } from '@/components/context/PersistentContext'
import { AssetSummary } from '@/lib/bindings'
import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'
import { UpdateDialogContext } from '@/components/context/UpdateDialogContext'

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
  dataManagementDialogAssetId: string | null
  dataManagementDialogOpen: boolean
  setDataManagementDialogOpen: (open: boolean) => void
  openDataManagementDialog: (assetId: string) => void
}

export const useTopPage = (): ReturnProps => {
  const { sortBy } = useContext(PersistentContext)
  const [assetDisplaySortedList, setAssetDisplaySortedList] = useState<
    AssetSummary[]
  >([])
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null)
  const [addAssetDialogOpen, setAddAssetDialogOpen] = useState(false)

  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)
  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)

  const [dataManagementDialogOpen, setDataManagementDialogOpen] =
    useState(false)
  const [dataManagementDialogAssetId, setDataManagementDialogAssetId] =
    useState<string | null>(null)

  const [showingAssetCount, setShowingAssetCount] = useState(0)

  const [isDragAndHover, setDragAndHover] = useState(false)

  const { register } = useContext(DragDropContext)
  const { checkForUpdate } = useContext(UpdateDialogContext)

  const assetContextValue: AssetContextType = {
    assetDisplaySortedList: assetDisplaySortedList,
    setAssetDisplaySortedList: setAssetDisplaySortedList,

    filteredIds: filteredIds,
    setFilteredIds: setFilteredIds,

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

  const executeUpdateCheck = async () => {
    await checkForUpdate()
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
    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    setDataManagementDialogOpen,
    openDataManagementDialog,
  }
}
