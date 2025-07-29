import { FileInfo } from '@/lib/bindings'

import { FC } from 'react'
import { useDependencyDialogStore } from '@/stores/dialogs/DependencyDialogStore'
import { InternalDependencyDialog } from './internal'

type Props = {
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
}

export const DependencyDialog: FC<Props> = ({
  openSelectUnitypackageDialog,
}) => {
  const { isOpen, setOpen, currentAsset } = useDependencyDialogStore()

  return (
    <InternalDependencyDialog
      isOpen={isOpen}
      setOpen={setOpen}
      loading={currentAsset === null}
      name={currentAsset?.name ?? ''}
      dependencies={currentAsset?.dependencies ?? []}
      openSelectUnitypackageDialog={openSelectUnitypackageDialog}
    />
  )
}
