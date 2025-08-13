import { FC } from 'react'
import { useMemoDialogStore } from '@/stores/dialogs/MemoDialogStore'
import { InternalMemoDialog } from './internal'

export const MemoDialog: FC = () => {
  const { isOpen, setOpen, currentAsset } = useMemoDialogStore()

  return (
    <InternalMemoDialog
      isOpen={isOpen}
      setOpen={setOpen}
      loading={currentAsset === null}
      name={currentAsset?.name ?? ''}
      memo={currentAsset?.memo ?? ''}
    />
  )
}
