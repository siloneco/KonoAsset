import { useToast } from '@/hooks/use-toast'
import { commands, FileInfo } from '@/lib/bindings'

type Props = {
  id: string
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
  openDialog: () => void
}

type ReturnProps = {
  onMainButtonClick: () => Promise<void>
  onOpenManagedDirButtonClick: () => Promise<void>
  onCopyPathButtonClick: () => Promise<void>
}

export const useAssetCardOpenButton = ({
  id,
  setUnitypackageFiles,
  openDialog,
}: Props): ReturnProps => {
  const { toast } = useToast()

  const onMainButtonClick = async () => {
    const result = await commands.listUnitypackageFiles(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
      return
    }

    const data: {
      [x: string]: FileInfo[]
    } = result.data

    if (Object.keys(data).length === 0) {
      onOpenManagedDirButtonClick()
      return
    }

    if (Object.keys(data).length === 1 && Object.values(data)[0].length === 1) {
      const item = Object.values(data)[0][0]

      const result = await commands.openFileInFileManager(item.absolutePath)

      if (result.status === 'error') {
        toast({
          title: 'エラー',
          description: result.error,
        })
        return
      }

      return
    }

    setUnitypackageFiles(data)
    openDialog()
  }

  const onOpenManagedDirButtonClick = async () => {
    const result = await commands.openManagedDir(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
    }
  }

  const onCopyPathButtonClick = async () => {
    const result = await commands.getDirectoryPath(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
      return
    }

    navigator.clipboard.writeText(result.data)
  }

  return {
    onMainButtonClick,
    onOpenManagedDirButtonClick,
    onCopyPathButtonClick,
  }
}
