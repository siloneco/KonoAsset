import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type ReturnProps = {
  taskId: string | null
  startImport: () => Promise<void>
  onCompleted: () => Promise<void>
  onCancelled: () => Promise<void>
  onFailed: (error: string | null) => Promise<void>
}

export const useImportSection = (): ReturnProps => {
  const [taskId, setTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  const startImport = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    })

    if (dir === null) {
      return
    }

    const result = await commands.importFromOtherDataStore(dir)

    if (result.status === 'error') {
      toast({
        title: 'インポートに失敗しました',
        description: result.error,
      })
      return
    }

    setTaskId(result.data)
  }

  const onCompleted = async () => {
    setTaskId(null)
    toast({
      title: 'インポートが完了しました！',
    })
  }

  const onCancelled = async () => {
    setTaskId(null)
    toast({
      title: 'インポートがキャンセルされました',
    })
  }

  const onFailed = async (error: string | null) => {
    setTaskId(null)
    toast({
      title: 'インポートに失敗しました',
      description: error,
    })
  }

  return {
    taskId,
    startImport,
    onCompleted,
    onCancelled,
    onFailed,
  }
}
