import { PreferenceContext } from '@/components/context/PreferenceContext'
import { useToast } from '@/hooks/use-toast'
import { commands, FileInfo } from '@/lib/bindings'
import { OctagonAlert } from 'lucide-react'
import { useContext, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  id: string
  hasDependencies: boolean
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
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
  hasDependencies,
  openSelectUnitypackageDialog,
}: Props): ReturnProps => {
  const [mainButtonLoading, setMainButtonLoading] = useState(false)
  const [mainButtonChecked, setMainButtonChecked] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()
  const { preference } = useContext(PreferenceContext)

  const showDependencyWarning = () => {
    toast({
      icon: <OctagonAlert className="text-primary" />,
      title: t('assetcard:open-button:show-dependency-warning-toast'),
      description: t(
        'assetcard:open-button:show-dependency-warning-toast:description',
      ),
      duration: 5000,
    })
  }

  const openFileManagerOrUnitypackageSelector = async (): Promise<boolean> => {
    const result = await commands.listUnitypackageFiles(id)

    if (result.status === 'error') {
      toast({
        title: t('general:error'),
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
          title: t('general:error'),
          description: result.error,
        })
        return false
      }

      if (hasDependencies) {
        showDependencyWarning()
      }

      return true
    }

    if (hasDependencies) {
      showDependencyWarning()
    }

    openSelectUnitypackageDialog(id, impartialData)
    return false
  }

  const onMainButtonClick = async () => {
    setMainButtonLoading(true)

    try {
      let result
      if (preference.useUnitypackageSelectedOpen) {
        result = await openFileManagerOrUnitypackageSelector()
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
        title: t('general:error'),
        description: result.error,
      })
      return false
    }

    if (hasDependencies) {
      showDependencyWarning()
    }
    return true
  }

  const onCopyPathButtonClick = async () => {
    const result = await commands.getDirectoryPath(id)

    if (result.status === 'error') {
      toast({
        title: t('general:error'),
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
