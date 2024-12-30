import { useToast } from '@/hooks/use-toast'
import { commands, Result } from '@/lib/bindings'
import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type Props = {
  setDataDir: (
    dataDir: string,
    migrateData: boolean,
  ) => Promise<Result<null, string>>
}

type ReturnProps = {
  dialogOpen: boolean
  migrateDestinationPath: string
  migrateData: boolean
  setMigrateData: (migrateData: boolean) => void
  executeButtonDisabled: boolean
  executing: boolean

  onDialogOpenChange: (isOpen: boolean) => void
  onOpenButtonClick: () => Promise<void>
  onSelectMigrateDestinationPathClick: () => Promise<void>
  onExecuteButtonClick: () => Promise<void>
}

export const useDataDirSelector = ({ setDataDir }: Props): ReturnProps => {
  const [migrateDestinationPath, setMigrateDestinationPath] = useState('')
  const [migrateData, setMigrateData] = useState(true)
  const [executeButtonDisabled, setExecuteButtonDisabled] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { toast } = useToast()

  const onDialogOpenChange = (isOpen: boolean) => {
    if (executing) {
      return
    }

    setDialogOpen(isOpen)
    if (isOpen) {
      setMigrateDestinationPath('')
      setMigrateData(true)
      setExecuteButtonDisabled(true)
      setExecuting(false)
    }
  }

  const onOpenButtonClick = async () => {
    const result = await commands.openDataDir()

    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  const onSelectMigrateDestinationPathClick = async () => {
    const path = await open({
      directory: true,
      multiple: false,
    })

    if (path === null) {
      return
    }

    setMigrateDestinationPath(path)
    setExecuteButtonDisabled(false)
  }

  const onExecuteButtonClick = async () => {
    setExecuting(true)

    try {
      const result = await setDataDir(migrateDestinationPath, migrateData)

      if (result.status === 'error') {
        toast({
          title: 'データフォルダの移行に失敗しました',
          description: result.error,
        })
        return
      }

      toast({
        title: 'データフォルダの移行に成功しました！',
      })

      setExecuting(false)
      setDialogOpen(false)
    } finally {
      setExecuting(false)
    }
  }

  return {
    dialogOpen,
    migrateDestinationPath,
    migrateData,
    setMigrateData,
    executeButtonDisabled,
    executing,
    onDialogOpenChange,
    onOpenButtonClick,
    onSelectMigrateDestinationPathClick,
    onExecuteButtonClick,
  }
}
