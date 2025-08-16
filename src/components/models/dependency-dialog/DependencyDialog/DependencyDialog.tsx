import { FC } from 'react'
import { useDependencyDialogStore } from '@/stores/dialogs/DependencyDialogStore'
import { InternalDependencyDialog } from './internal'

export const DependencyDialog: FC = () => {
  const { isOpen, setOpen, currentAsset } = useDependencyDialogStore()

  return (
    <InternalDependencyDialog
      isOpen={isOpen}
      setOpen={setOpen}
      loading={currentAsset === null}
      name={currentAsset?.name ?? ''}
      dependencies={currentAsset?.dependencies ?? []}
    />
  )
}
