import { create } from 'zustand'
import { DragDropHandler } from './index.types'
import { DEFAULT_PRIORITY } from './index.constants'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'

type Props = {
  sortedHandlers: DragDropHandler[]
  register: (handler: DragDropHandler) => void
  onDragDrop: (event: Event<DragDropEvent>) => Promise<void>
}

export const useDragDropStore = create<Props>((set, get) => ({
  sortedHandlers: [],
  register: (handler) => {
    const beforeSort = [
      ...get().sortedHandlers.filter((h) => h.uniqueId !== handler.uniqueId),
      handler,
    ]

    const sortedHandlers = beforeSort.sort((a, b) => {
      const aPriority = a.priority ?? DEFAULT_PRIORITY
      const bPriority = b.priority ?? DEFAULT_PRIORITY

      if (aPriority === bPriority) {
        return a.uniqueId.localeCompare(b.uniqueId)
      }

      return aPriority - bPriority
    })

    set(() => ({
      sortedHandlers,
    }))
  },
  onDragDrop: async (event: Event<DragDropEvent>) => {
    const { sortedHandlers } = get()

    for (const handler of sortedHandlers) {
      const { fn } = handler

      const stopPropagation = await fn(event)

      if (stopPropagation) {
        break
      }
    }
  },
}))
