import {
  DragDropContext,
  DragDropUser,
} from '@/components/context/DragDropContext'
import { commands, SimplifiedDirEntry } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { open } from '@tauri-apps/plugin-dialog'
import { useContext, useEffect, useRef, useState } from 'react'

type Props = {
  assetId: string | null
  dialogOpen: boolean
}

type ReturnProps = {
  entries: SimplifiedDirEntry[]
  ongoingImports: OngoingImportEntry[]
  markOngoingImportAsFinished: (taskId: string) => void
  onAddButtonClicked: (isDir: boolean) => Promise<void>
  refreshEntries: () => Promise<void>
  refreshButtonCheckMarked: boolean
}

type OngoingImportEntry = {
  taskId: string
  path: string
}

const refetchEntries = async (
  assetId: string | null,
  setEntries: (entries: SimplifiedDirEntry[]) => void,
) => {
  if (assetId === null) {
    setEntries([])
    return
  }

  const fetchedEntries = await commands.listAssetDirEntry(assetId)

  if (fetchedEntries.status === 'ok') {
    const data = fetchedEntries.data
    setEntries(data)
  } else {
    console.error(fetchedEntries.error)
  }
}

const useDataManagementDialog = ({
  assetId,
  dialogOpen,
}: Props): ReturnProps => {
  const [entries, setEntries] = useState<SimplifiedDirEntry[]>([])
  const [ongoingImports, setOngoingImports] = useState<OngoingImportEntry[]>([])
  const [finishedImportTaskIDs, setFinishedImportTaskIDs] = useState<string[]>(
    [],
  )
  const [refreshButtonCheckMarked, setRefreshButtonCheckMarked] =
    useState(false)

  const { current, lock } = useContext(DragDropContext)

  const currentDragDropUser = useRef<DragDropUser | null>(null)
  const ongoingImportsRef = useRef<OngoingImportEntry[]>(ongoingImports)

  useEffect(() => {
    currentDragDropUser.current = current
    ongoingImportsRef.current = ongoingImports
  }, [current, ongoingImports])

  useEffect(() => {
    if (!dialogOpen) {
      return
    }

    const unlock = lock('AssetDataManagementDialog')

    return () => {
      unlock()
    }
  }, [assetId, dialogOpen])

  const refresh = async (checkReloadButton: boolean) => {
    await refetchEntries(assetId, setEntries)

    setOngoingImports(
      ongoingImports.filter((entry) => {
        return !finishedImportTaskIDs.includes(entry.taskId)
      }),
    )

    setFinishedImportTaskIDs([])

    if (checkReloadButton) {
      setRefreshButtonCheckMarked(true)
      setTimeout(() => {
        setRefreshButtonCheckMarked(false)
      }, 1000)
    }
  }

  useEffect(() => {
    if (!dialogOpen) {
      ongoingImports.forEach((entry) => {
        commands.cancelTaskRequest(entry.taskId)
      })

      setOngoingImports([])
      ongoingImportsRef.current = []
    }
  }, [dialogOpen])

  useEffect(() => {
    setOngoingImports([])
    ongoingImportsRef.current = []
    setFinishedImportTaskIDs([])
    refresh(false)
  }, [assetId, dialogOpen])

  const markOngoingImportAsFinished = (taskId: string) => {
    setFinishedImportTaskIDs([...finishedImportTaskIDs, taskId])
  }

  const startImporting = async (paths: string[]) => {
    if (assetId === null) {
      return
    }

    const result = await commands.importFileEntriesToAsset(assetId, paths)

    if (result.status === 'ok') {
      const ongoing = []

      for (let i = 0; i < paths.length; i++) {
        ongoing.push({
          taskId: result.data[i],
          path: paths[i],
        })
      }

      setOngoingImports([...ongoingImportsRef.current, ...ongoing])
    } else {
      console.error(result.error)
    }
  }

  const onAddButtonClicked = async (isDir: boolean) => {
    if (assetId === null) {
      return
    }

    const paths = await open({
      multiple: true,
      directory: isDir,
    })

    if (paths === null) {
      return
    }

    await startImporting(paths)
  }

  useEffect(() => {
    let isCancelled = false
    let unlistenFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      unlistenFn = await getCurrentWindow().onDragDropEvent((event) => {
        if (isCancelled) return
        if (currentDragDropUser.current !== 'AssetDataManagementDialog') return

        const type = event.payload.type

        if (type !== 'drop') {
          return
        }

        const paths = event.payload.paths
        if (paths.length === 0) {
          return
        }

        startImporting(paths)
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
  }, [assetId])

  return {
    entries,
    ongoingImports,
    markOngoingImportAsFinished,
    onAddButtonClicked,
    refreshEntries: () => refresh(true),
    refreshButtonCheckMarked,
  }
}

export default useDataManagementDialog
