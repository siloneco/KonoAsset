import { useCallback, useState } from 'react'

type Props = {
  deleteAppData: boolean
  deleteMetadata: boolean
  deleteAssetData: boolean

  confirm: boolean
  deleteInProgress: boolean

  setDeleteAppData: (deleteAppData: boolean) => void
  setDeleteMetadata: (deleteMetadata: boolean) => void
  setDeleteAssetData: (deleteAssetData: boolean) => void
  setConfirm: (confirm: boolean) => void
}

type ReturnProps = {
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
  submitButtonDisabled: boolean
}

export const useInternalResetDialog = ({
  deleteAppData,
  deleteMetadata,
  deleteAssetData,

  confirm,
  deleteInProgress,

  setDeleteAppData,
  setDeleteMetadata,
  setDeleteAssetData,
  setConfirm,
}: Props): ReturnProps => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const isOneOfThemChecked = deleteAppData || deleteMetadata || deleteAssetData
  const submitButtonDisabled =
    deleteInProgress || !confirm || !isOneOfThemChecked

  const wrappedSetDialogOpen = useCallback(
    (dialogOpen: boolean) => {
      setDialogOpen(dialogOpen)

      if (!dialogOpen) {
        setDeleteAppData(false)
        setDeleteMetadata(false)
        setDeleteAssetData(false)
        setConfirm(false)
      }
    },
    [setConfirm, setDeleteAppData, setDeleteMetadata, setDeleteAssetData],
  )

  return {
    dialogOpen,
    setDialogOpen: wrappedSetDialogOpen,
    submitButtonDisabled,
  }
}
