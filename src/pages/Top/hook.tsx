import { useState, useEffect, useContext } from 'react'
import { onFileDrop } from './logic'
import { UpdateDialogContext } from '@/components/context/UpdateDialogContext'
import { useDragDropStore } from '@/stores/DragDropStore'
import { DragDropHandler } from '@/stores/DragDropStore/index.types'

type ReturnProps = {
  isDragAndHover: boolean
  showingAssetCount: number
  setShowingAssetCount: (count: number) => void
  addAssetDialogOpen: boolean
  setAddAssetDialogOpen: (open: boolean) => void
  setEditAssetDialogAssetId: (assetId: string | null) => void
  setEditAssetDialogOpen: (open: boolean) => void
  editAssetDialogAssetId: string | null
  editAssetDialogOpen: boolean
}

export const useTopPage = (): ReturnProps => {
  const [addAssetDialogOpen, setAddAssetDialogOpen] = useState(false)

  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)
  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)

  const [showingAssetCount, setShowingAssetCount] = useState(0)

  const [isDragAndHover, setDragAndHover] = useState(false)

  const { register } = useDragDropStore()
  const { checkForUpdate } = useContext(UpdateDialogContext)

  useEffect(() => {
    const handler: DragDropHandler = {
      uniqueId: 'top-page',
      priority: 0,
      fn: async (event) => {
        onFileDrop(event, setDragAndHover)
        return false
      },
    }

    register(handler)
  }, [register])

  useEffect(() => {
    checkForUpdate()
  }, [checkForUpdate])

  return {
    isDragAndHover,
    showingAssetCount,
    setShowingAssetCount,
    addAssetDialogOpen,
    setAddAssetDialogOpen,
    setEditAssetDialogAssetId,
    setEditAssetDialogOpen,
    editAssetDialogAssetId,
    editAssetDialogOpen,
  }
}
