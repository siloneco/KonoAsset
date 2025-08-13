import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'

export type DragDropHandler = {
  uniqueId: string
  priority?: number
  fn: DragDropHandlingFn
}

type DragDropHandlingFn = (event: Event<DragDropEvent>) => Promise<boolean>
