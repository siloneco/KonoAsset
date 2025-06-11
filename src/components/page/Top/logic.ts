import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/webview'

export const onFileDrop = (
  event: Event<DragDropEvent>,
  setDragAndHover: (isDragAndHover: boolean) => void,
) => {
  if (event.payload.type == 'over') {
    return
  }

  if (event.payload.type == 'enter') {
    setDragAndHover(true)
  } else {
    setDragAndHover(false)
  }
}
