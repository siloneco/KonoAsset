import { commands, SimplifiedDirEntry } from '@/lib/bindings'
import { create } from 'zustand'
import { OngoingImportEntry } from './index.types'
import { listDirEntries } from './logic'

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  open: (assetId: string) => void

  loading: boolean
  id: string | null

  entries: SimplifiedDirEntry[]
  ongoingImports: OngoingImportEntry[]

  importItems: (path: string[]) => Promise<void>
  refreshEntries: () => Promise<void>
  onTaskCompleted: (taskId: string) => void
}

export const useDataManagementDialogStore = create<Props>((set, get) => ({
  isOpen: false,
  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },
  open: (assetId: string) => {
    set({ isOpen: true, loading: true, id: assetId, entries: [] })

    listDirEntries(assetId)
      .then((entries) => {
        set({ loading: false, entries: entries ?? [] })
      })
      .catch(() => {
        set({ loading: false, entries: [] })
      })
  },

  loading: true,
  id: null,
  entries: [],
  ongoingImports: [],

  importItems: async (paths: string[]) => {
    const id = get().id

    if (id === null) {
      return
    }

    const result = await commands.importFileEntriesToAsset(id, paths)

    if (result.status === 'ok') {
      const taskIds = result.data

      const ongoingImports = paths.map((path, index) => ({
        path,
        taskId: taskIds[index],
        completed: false,
      }))

      const currentOngoingImports = get().ongoingImports

      set({ ongoingImports: [...currentOngoingImports, ...ongoingImports] })
    } else {
      console.error(result.error)
    }
  },
  refreshEntries: async () => {
    const current = get()

    if (current.id === null) {
      return
    }

    const ongoingImports = current.ongoingImports.filter(
      (entry) => entry.completed === false,
    )
    const entries = await listDirEntries(current.id)

    set({ entries: entries ?? [], ongoingImports })
  },
  onTaskCompleted: (taskId: string) => {
    const current = get()

    const ongoingImports = current.ongoingImports.map((entry) => {
      if (entry.taskId === taskId) {
        return { ...entry, completed: true }
      }
      return entry
    })

    set({ ongoingImports })
  },
}))
