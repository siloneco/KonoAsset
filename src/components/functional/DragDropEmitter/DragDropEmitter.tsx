import { useDragDropStore } from '@/stores/DragDropStore'
import { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { FC, ReactNode, useEffect } from 'react'

type Props = {
  children: ReactNode
}

export const DragDropEmitter: FC<Props> = ({ children }) => {
  const { onDragDrop } = useDragDropStore()

  useEffect(() => {
    let isCancelled = false
    let unlistenFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      unlistenFn = await getCurrentWindow().onDragDropEvent(async (event) => {
        if (isCancelled) return
        await onDragDrop(event)
      })

      if (isCancelled) {
        unlistenFn()
        return
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenFn?.()
    }
  }, [onDragDrop])

  return <>{children}</>
}
