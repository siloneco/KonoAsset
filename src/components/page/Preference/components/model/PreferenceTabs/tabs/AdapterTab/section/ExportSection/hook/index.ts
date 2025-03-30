import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { commands, Result } from '@/lib/bindings'
import { open, save } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type ExportStyle = 'KonoAsset' | 'AvatarExplorer' | 'HumanReadable'

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
  const { t } = useLocalization()

  const [currentExportType, setCurrentExportType] =
    useState<ExportStyle | null>(null)
  const [exportDestination, setExportDestination] = useState<string | null>(
    null,
  )

  const [taskId, setTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  const setExportType = (type: ExportStyle) => {
    setExportDestination(null)
    setCurrentExportType(type)
  }

  const selectExportDestination = async () => {
    const isZip = currentExportType !== 'AvatarExplorer'

    let path: string | null = null
    if (isZip) {
      path = await save({
        defaultPath: 'KonoAsset-exported.zip',
        filters: [{ name: 'zip', extensions: ['zip'] }],
      })
    } else {
      path = await open({
        canCreateDirectories: true,
        directory: true,
      })
    }

    if (path === null) {
      return
    }

    setExportDestination(path)
  }

  const startExport = async () => {
    if (exportDestination === null || currentExportType === null) {
      return
    }

    let result: Result<string, string>
    if (currentExportType === 'KonoAsset') {
      result = await commands.exportAsKonoassetZip(exportDestination)
    } else if (currentExportType === 'HumanReadable') {
      result = await commands.exportAsHumanReadableZip(exportDestination)
    } else if (currentExportType === 'AvatarExplorer') {
      result = await commands.exportForAvatarExplorer(exportDestination)
    } else {
      console.error('Unsupported export type: ' + currentExportType)
      return
    }

    if (result.status === 'error') {
      toast({
        title: t('preference:adapter:export:failed'),
        description: result.error,
      })
      return
    }

    setTaskId(result.data)
  }

  const onCompleted = async () => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:export:completed'),
    })
  }

  const onCancelled = async () => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:export:cancelled'),
    })
  }

  const onFailed = async (error: string | null) => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:export:failed'),
      description: error,
    })
  }

  const exportButtonActivated =
    currentExportType !== null && exportDestination !== null

  return {
    currentExportType,
    setExportType,
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
