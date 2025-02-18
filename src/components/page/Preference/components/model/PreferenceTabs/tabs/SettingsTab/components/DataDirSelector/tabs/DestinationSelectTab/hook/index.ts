import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type Props = {
  switchToProgressTab: (taskId: string) => void
  destinationPath: string
  setDestinationPath: (path: string) => void
  migrationEnabled: boolean
}

type ReturnProps = {
  executeButtonDisabled: boolean
  executing: boolean

  onOpenButtonClick: () => Promise<void>
  onSelectDestinationPathClick: () => Promise<void>
  onExecuteButtonClick: () => Promise<void>
}

export const useDestinationSelectTab = ({
  switchToProgressTab,
  destinationPath,
  setDestinationPath,
  migrationEnabled,
}: Props): ReturnProps => {
  const [executeButtonDisabled, setExecuteButtonDisabled] = useState(true)
  const [executing, setExecuting] = useState(false)
  const { toast } = useToast()

  const onOpenButtonClick = async () => {
    const result = await commands.openDataDir()

    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  const onSelectDestinationPathClick = async () => {
    const path = await open({
      directory: true,
      multiple: false,
      defaultPath: 'file:\\\\PC',
    })

    if (path === null) {
      return
    }

    setDestinationPath(path)
    setExecuteButtonDisabled(false)
  }

  const onExecuteButtonClick = async () => {
    setExecuting(true)
    try {
      const result = await commands.migrateDataDir(
        destinationPath,
        migrationEnabled,
      )

      if (result.status === 'error') {
        toast({
          title: 'データフォルダの移行に失敗しました',
          description: result.error,
        })
        return
      }

      const taskId = result.data
      switchToProgressTab(taskId)
    } finally {
      setExecuting(false)
    }
  }

  return {
    executeButtonDisabled,
    executing,

    onOpenButtonClick,
    onSelectDestinationPathClick,
    onExecuteButtonClick,
  }
}
