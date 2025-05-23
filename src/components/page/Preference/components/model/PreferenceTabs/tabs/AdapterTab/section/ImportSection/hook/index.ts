import { useLocalization } from '@/hooks/use-localization'
import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type ReturnProps = {
  taskId: string | null
  startImportUsingDirectory: () => Promise<void>
  startImportUsingZipFile: () => Promise<void>
  onCompleted: () => Promise<void>
  onCancelled: () => Promise<void>
  onFailed: (error: string | null) => Promise<void>
}

export const useImportSection = (): ReturnProps => {
  const { t } = useLocalization()

  const [taskId, setTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  const executeImport = async (path: string) => {
    const result = await commands.importFromOtherDataStore(path)

    if (result.status === 'error') {
      toast({
        title: t('preference:adapter:import:failed'),
        description: result.error,
      })
      return
    }

    setTaskId(result.data)
  }

  const startImportUsingDirectory = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    })

    if (dir === null) {
      return
    }

    await executeImport(dir)
  }

  const startImportUsingZipFile = async () => {
    const zipFile = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'zip', extensions: ['zip'] }],
    })

    if (zipFile === null) {
      return
    }

    await executeImport(zipFile)
  }

  const onCompleted = async () => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:import:completed'),
    })
  }

  const onCancelled = async () => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:import:cancelled'),
    })
  }

  const onFailed = async (error: string | null) => {
    setTaskId(null)
    toast({
      title: t('preference:adapter:import:failed'),
      description: error,
    })
  }

  return {
    taskId,
    startImportUsingDirectory,
    startImportUsingZipFile,
    onCompleted,
    onCancelled,
    onFailed,
  }
}
