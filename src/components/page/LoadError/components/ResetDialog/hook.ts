import { commands } from '@/lib/bindings'
import { useState } from 'react'

type ReturnProps = {
  deleteAppData: boolean
  deleteMetadata: boolean
  deleteAssetData: boolean

  setDeleteAppData: (deleteAppData: boolean) => void
  setDeleteMetadata: (deleteMetadata: boolean) => void
  setDeleteAssetData: (deleteAssetData: boolean) => void

  executeReset: () => Promise<void>

  executing: boolean

  confirm: boolean
  setConfirm: (confirm: boolean) => void

  submitButtonDisabled: boolean
}

export const useResetDialog = (): ReturnProps => {
  const [deleteAppData, setDeleteAppData] = useState(false)
  const [deleteMetadata, setDeleteMetadata] = useState(false)
  const [deleteAssetData, setDeleteAssetData] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const executeReset = async () => {
    try {
      setExecuting(true)
      await commands.resetApplication({
        deleteAssetData,
        deleteMetadata,
        resetPreferences: deleteAppData,
      })
    } finally {
      setExecuting(false)
    }
  }

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
    executeReset,
    executing,
    confirm,
    setConfirm,
    submitButtonDisabled:
      !confirm ||
      executing ||
      (!deleteAppData && !deleteMetadata && !deleteAssetData),
  }
}
