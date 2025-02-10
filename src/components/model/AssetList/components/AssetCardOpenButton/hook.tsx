import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useToast } from '@/hooks/use-toast'
import { commands, FileInfo } from '@/lib/bindings'
import { useContext, useState } from 'react'

type Props = {
  id: string
  setUnitypackageFiles: (data: { [x: string]: FileInfo[] }) => void
  openSelectUnitypackageDialog: () => void
}

type ReturnProps = {
  onMainButtonClick: () => Promise<void>
  mainButtonLoading: boolean
  mainButtonChecked: boolean
  onOpenManagedDirButtonClick: () => Promise<void>
  onCopyPathButtonClick: () => Promise<void>
}

export const useAssetCardOpenButton = ({
  id,
  setUnitypackageFiles,
  openSelectUnitypackageDialog,
}: Props): ReturnProps => {
  const [mainButtonLoading, setMainButtonLoading] = useState(false)
  const [mainButtonChecked, setMainButtonChecked] = useState(false)

  const { toast } = useToast()
  const { preference } = useContext(PreferenceContext)

  const listUnitypackageAndOpen = async (): Promise<boolean> => {
    const result = await commands.listUnitypackageFiles(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
      return false
    }

    const data = result.data
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key],
    )

    const impartialData = data as { [x: string]: FileInfo[] }

    if (Object.keys(data).length === 0) {
      return await onOpenManagedDirButtonClick()
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
        return false
      }

      return true
    }

    setUnitypackageFiles(impartialData)
    openSelectUnitypackageDialog()
    return false
  }

  const onMainButtonClick = async () => {
    setMainButtonLoading(true)

    try {
      let result
      if (preference.useUnitypackageSelectedOpen) {
        result = await listUnitypackageAndOpen()
      } else {
        result = await onOpenManagedDirButtonClick()
      }

      if (result) {
        setMainButtonChecked(true)
        setTimeout(() => {
          setMainButtonChecked(false)
        }, 1000)
      }
    } finally {
      setMainButtonLoading(false)
    }
  }

  const onOpenManagedDirButtonClick = async (): Promise<boolean> => {
    const result = await commands.openManagedDir(id)

    if (result.status === 'error') {
      toast({
        title: 'エラー',
        description: result.error,
      })
      return false
    }

    return true
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
    mainButtonLoading,
    mainButtonChecked,
    onOpenManagedDirButtonClick: async () => {
      await onOpenManagedDirButtonClick()
    },
    onCopyPathButtonClick,
  }
}
