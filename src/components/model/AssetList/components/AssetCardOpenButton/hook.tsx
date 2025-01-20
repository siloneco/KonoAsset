import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useToast } from '@/hooks/use-toast'
import { commands, FileInfo } from '@/lib/bindings'
import { useContext } from 'react'

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
  const { preference } = useContext(PreferenceContext)

  const listUnitypackageAndOpen = async () => {
    const result = await commands.listUnitypackageFiles(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
      return
    }

    const data = result.data
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key],
    )

    const impartialData = data as { [x: string]: FileInfo[] }

    if (Object.keys(data).length === 0) {
      onOpenManagedDirButtonClick()
      return
    }

    if (
      Object.keys(impartialData).length === 1 &&
      Object.values(impartialData)[0].length === 1
    ) {
      const item = Object.values(impartialData)[0][0]

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

    setUnitypackageFiles(impartialData)
    openDialog()
  }

  const onMainButtonClick = async () => {
    if (preference.useUnitypackageSelectedOpen) {
      await listUnitypackageAndOpen()
    } else {
      await onOpenManagedDirButtonClick()
    }
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
