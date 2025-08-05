import { useCallback, useState } from 'react'
import { executeReset } from '../logic'

type ReturnProps = {
  deleteAppData: boolean
  deleteMetadata: boolean
  deleteAssetData: boolean

  setDeleteAppData: (deleteAppData: boolean) => void
  setDeleteMetadata: (deleteMetadata: boolean) => void
  setDeleteAssetData: (deleteAssetData: boolean) => void

  confirm: boolean
  setConfirm: (confirm: boolean) => void

  deleteInProgress: boolean
  onExecuteButtonClick: () => Promise<void>
}

export const useResetDialog = (): ReturnProps => {
  const [deleteAppData, setDeleteAppData] = useState(false)
  const [deleteMetadata, setDeleteMetadata] = useState(false)
  const [deleteAssetData, setDeleteAssetData] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const onExecuteButtonClick = useCallback(async () => {
    setDeleteInProgress(true)
    try {
      await executeReset({ deleteAppData, deleteMetadata, deleteAssetData })
    } finally {
      setDeleteInProgress(false)
    }
  }, [deleteAppData, deleteMetadata, deleteAssetData])

  return {
    deleteAppData,
    deleteMetadata,
    deleteAssetData,

    setDeleteAppData: (v) => {
      setDeleteAppData(v)
      setConfirm(false)
    },
    setDeleteMetadata: (v) => {
      setDeleteMetadata(v)
      setConfirm(false)
    },
    setDeleteAssetData: (v) => {
      setDeleteAssetData(v)
      setConfirm(false)
    },

    confirm,
    setConfirm,

    deleteInProgress,
    onExecuteButtonClick,
  }
}
