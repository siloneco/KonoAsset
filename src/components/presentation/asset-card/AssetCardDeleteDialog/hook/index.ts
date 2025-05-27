import { useState } from 'react'

type Props = {
  setDialogOpen: (open: boolean) => void
  deleteAsset: () => Promise<void>
}

type ReturnProps = {
  deleteInProgress: boolean
  onDeleteButtonClicked: () => Promise<void>
}

export const useAssetCardDeleteDialog = ({
  setDialogOpen,
  deleteAsset,
}: Props): ReturnProps => {
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const onDeleteButtonClicked = async () => {
    try {
      setDeleteInProgress(true)
      await deleteAsset()
      setDialogOpen(false)
    } finally {
      setDeleteInProgress(false)
    }
  }

  return {
    deleteInProgress,
    onDeleteButtonClicked,
  }
}
