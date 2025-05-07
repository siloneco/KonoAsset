import { createContext, ReactNode } from 'react'
import { UpdateDialog } from '@/components/model/UpdateDialog'
import { useUpdateDialogContext } from './hook'

export type UpdateDialogContextType = {
  checkForUpdate: () => Promise<void>
}

export const UpdateDialogContext = createContext<UpdateDialogContextType>({
  checkForUpdate: async () => {},
})

type Props = {
  children: ReactNode
}

export const UpdateDialogProvider = ({ children }: Props) => {
  const {
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
    checkForUpdate,
  } = useUpdateDialogContext()

  return (
    <UpdateDialogContext.Provider value={{ checkForUpdate }}>
      {children}
      <UpdateDialog
        dialogOpen={updateDialogOpen}
        setDialogOpen={setUpdateDialogOpen}
        taskId={updateDownloadTaskId}
      />
    </UpdateDialogContext.Provider>
  )
}
