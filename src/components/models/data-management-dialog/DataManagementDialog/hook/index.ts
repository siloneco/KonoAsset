import { SimplifiedDirEntry } from '@/lib/bindings'
import { useDataManagementDialogStore } from '@/stores/dialogs/DataManagementDialogStore'
import { OngoingImportEntry } from '@/stores/dialogs/DataManagementDialogStore/index.types'
import { useDragDropStore } from '@/stores/DragDropStore'
import { DragDropHandler } from '@/stores/DragDropStore/index.types'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'
import { open } from '@tauri-apps/plugin-dialog'
import { useCallback, useEffect } from 'react'

type ReturnProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void

  id: string | null
  loading: boolean

  entries: SimplifiedDirEntry[]
  ongoingImports: OngoingImportEntry[]

  onAddButtonClick: (isDir: boolean) => Promise<void>
  refreshEntries: () => Promise<void>
}

export const useDataManagementDialog = (): ReturnProps => {
  const { register } = useDragDropStore()
  const {
    id,
    isOpen,
    setOpen,
    loading,
    entries,
    ongoingImports,
    importItems,
    refreshEntries,
  } = useDataManagementDialogStore()

  const onAddButtonClick = useCallback(
    async (isDir: boolean) => {
      if (id === null) {
        return
      }

      const paths = await open({
        multiple: true,
        directory: isDir,
      })

      if (paths === null) {
        return
      }

      await importItems(paths)
    },
    [id, importItems],
  )

  // ドラッグアンドドロップのイベントハンドラーを登録する
  const eventHandlingFn = useCallback(
    async (event: Event<DragDropEvent>): Promise<boolean> => {
      if (!isOpen) {
        return false
      }

      const type = event.payload.type

      if (type !== 'drop') {
        return false
      }

      const paths = event.payload.paths
      if (paths.length === 0) {
        return false
      }

      await importItems(paths)
      return true
    },
    [isOpen, importItems],
  )

  useEffect(() => {
    const dragDropHandler: DragDropHandler = {
      uniqueId: 'data-management-dialog',
      priority: 90,
      fn: eventHandlingFn,
    }

    register(dragDropHandler)
  }, [eventHandlingFn, register])

  return {
    isOpen,
    setOpen,
    loading,
    id,
    entries,
    ongoingImports,
    onAddButtonClick,
    refreshEntries,
  }
}
