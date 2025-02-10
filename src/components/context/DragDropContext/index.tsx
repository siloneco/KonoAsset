import { createContext, FC } from 'react'
import useDragDropContext from './hook'

export type DragDropUser = 'AddAssetDialog' | 'AssetDataManagementDialog'
type UnlockFn = () => void

export type DragDropContextType = {
  current: DragDropUser
  lock: (user: DragDropUser) => UnlockFn
}

export const DragDropContext = createContext<DragDropContextType>({
  current: 'AddAssetDialog',
  lock: () => () => {},
})

type Props = {
  children: React.ReactNode
}

const DragDropContextProvider: FC<Props> = ({ children }) => {
  const { dragDropContextValue } = useDragDropContext()

  return (
    <DragDropContext.Provider value={dragDropContextValue}>
      {children}
    </DragDropContext.Provider>
  )
}

export default DragDropContextProvider
