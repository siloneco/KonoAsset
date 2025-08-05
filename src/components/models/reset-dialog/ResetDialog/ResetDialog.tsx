import { useResetDialog } from './hook'
import { FC } from 'react'
import { InternalResetDialog } from './internal'

export const ResetDialog: FC = () => {
  const {
    deleteAppData,
    deleteMetadata,
    deleteAssetData,
    setDeleteAppData,
    setDeleteMetadata,
    setDeleteAssetData,
    onExecuteButtonClick,
    deleteInProgress,
    confirm,
    setConfirm,
  } = useResetDialog()

  return (
    <InternalResetDialog
      deleteInProgress={deleteInProgress}
      deleteAppData={deleteAppData}
      deleteMetadata={deleteMetadata}
      deleteAssetData={deleteAssetData}
      setDeleteAppData={setDeleteAppData}
      setDeleteMetadata={setDeleteMetadata}
      setDeleteAssetData={setDeleteAssetData}
      confirm={confirm}
      setConfirm={setConfirm}
      executeReset={onExecuteButtonClick}
    />
  )
}
