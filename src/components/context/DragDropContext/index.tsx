import { createContext, FC } from 'react'
import useDragDropContext from './hook'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'

export type DragDropRegisterConfig = {
  uniqueId: string
  priority?: number
}
export type DragDropHandlingFn = (
  event: Event<DragDropEvent>,
) => Promise<boolean>

export type DragDropContextType = {
  register: (config: DragDropRegisterConfig, fn: DragDropHandlingFn) => void
}

export const DragDropContext = createContext<DragDropContextType>({
  register: () => {},
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
