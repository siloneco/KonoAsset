import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'
import { commands, SimplifiedDirEntry } from '@/lib/bindings'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/window'
import { open } from '@tauri-apps/plugin-dialog'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

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

export const useDataManagementDialog = ({
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

  const { register } = useContext(DragDropContext)

  const ongoingImportsRef = useRef<OngoingImportEntry[]>(ongoingImports)
  const dialogOpenRef = useRef<boolean>(dialogOpen)
  const startImportingRef = useRef<
    (path: string[]) => Promise<void> | undefined
  >(async () => {})

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
  }, [dialogOpen, ongoingImports])

  const [prevAssetId, setPrevAssetId] = useState<string | null>(assetId)
  const [prevDialogOpen, setPrevDialogOpen] = useState<boolean>(dialogOpen)

  if (prevAssetId !== assetId || prevDialogOpen !== dialogOpen) {
    setPrevAssetId(assetId)
    setPrevDialogOpen(dialogOpen)

    setOngoingImports([])
    ongoingImportsRef.current = []
    setFinishedImportTaskIDs([])
    refresh(false)
  }

  const markOngoingImportAsFinished = (taskId: string) => {
    setFinishedImportTaskIDs((prevIDs) => {
      const updated = [...prevIDs, taskId]
      return updated
    })
  }

  const startImporting = useCallback(
    async (paths: string[]) => {
      if (assetId === null) {
        return
      }

      const result = await commands.importFileEntriesToAsset(assetId, paths)

      if (result.status === 'ok') {
        const ongoing: OngoingImportEntry[] = []

        for (let i = 0; i < paths.length; i++) {
          ongoing.push({
            taskId: result.data[i],
            path: paths[i],
          })
        }

        setOngoingImports((prev) => {
          return [...prev, ...ongoing]
        })
      } else {
        console.error(result.error)
      }
    },
    [assetId],
  )

  useEffect(() => {
    dialogOpenRef.current = dialogOpen
    ongoingImportsRef.current = ongoingImports
    startImportingRef.current = startImporting
  }, [dialogOpen, ongoingImports, startImporting])

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

  const eventHandlingFn = useCallback(
    async (event: Event<DragDropEvent>): Promise<boolean> => {
      if (!dialogOpenRef.current) {
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

      await startImportingRef.current(paths)
      return true
    },
    [],
  )

  useEffect(() => {
    const eventHandlingConfig: DragDropRegisterConfig = {
      uniqueId: 'data-management-dialog',
      priority: 90,
    }

    register(eventHandlingConfig, eventHandlingFn)
  }, [eventHandlingFn, register])

  return {
    entries,
    ongoingImports,
    markOngoingImportAsFinished,
    onAddButtonClicked,
    refreshEntries: () => refresh(true),
    refreshButtonCheckMarked,
  }
}
