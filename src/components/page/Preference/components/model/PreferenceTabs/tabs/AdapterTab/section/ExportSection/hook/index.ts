import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type ExportStyle = 'KonoAsset' | 'HumanReadable'

type ReturnProps = {
  currentExportType: ExportStyle | null
  setExportType: (type: ExportStyle) => void
  exportDestination: string | null
  selectExportDestination: () => Promise<void>
  exportButtonActivated: boolean
  startExport: () => Promise<void>
  taskId: string | null
  onCompleted: () => Promise<void>
  onCancelled: () => Promise<void>
  onFailed: (error: string | null) => Promise<void>
}

export const useExportSection = (): ReturnProps => {
  const [currentExportType, setCurrentExportType] =
    useState<ExportStyle | null>(null)
  const [exportDestination, setExportDestination] = useState<string | null>(
    null,
  )
  const [taskId, setTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  const selectExportDestination = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    })

    if (dir === null) {
      return
    }

    setExportDestination(dir)
  }

  const startExport = async () => {
    if (exportDestination === null || currentExportType === null) {
      return
    }

    if (currentExportType === 'HumanReadable') {
      const result = await commands.exportAsHumanReadableZip(exportDestination)

      if (result.status === 'error') {
        toast({
          title: 'エクスポートに失敗しました',
          description: result.error,
        })
        return
      }

      setTaskId(result.data)
    }
  }

  const onCompleted = async () => {
    setTaskId(null)
    toast({
      title: 'エクスポートが完了しました！',
    })
  }

  const onCancelled = async () => {
    setTaskId(null)
    toast({
      title: 'エクスポートがキャンセルされました',
    })
  }

  const onFailed = async (error: string | null) => {
    setTaskId(null)
    toast({
      title: 'エクスポートに失敗しました',
      description: error,
    })
  }

  const exportButtonActivated =
    currentExportType !== null && exportDestination !== null

  return {
    currentExportType,
    setExportType: setCurrentExportType,
    exportDestination,
    selectExportDestination,
    exportButtonActivated,
    startExport,
    taskId,
    onCompleted,
    onCancelled,
    onFailed,
  }
}
