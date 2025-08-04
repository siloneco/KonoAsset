import { useCallback, useState } from 'react'

type Props = {
  executeAssetDeletion: () => Promise<void>
}

type ReturnProps = {
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  deleteInProgress: boolean
  onDeleteConfirmButtonClick: () => void
}

export const useInternalAssetCardMeatballMenu = ({
  executeAssetDeletion,
}: Props): ReturnProps => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const onDeleteConfirmButtonClick = useCallback(async () => {
    setDeleteInProgress(true)
    try {
      await executeAssetDeletion()
      setDeleteDialogOpen(false)
    } finally {
      setDeleteInProgress(false)
    }
  }, [executeAssetDeletion])

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteInProgress,
    onDeleteConfirmButtonClick,
  }
}
