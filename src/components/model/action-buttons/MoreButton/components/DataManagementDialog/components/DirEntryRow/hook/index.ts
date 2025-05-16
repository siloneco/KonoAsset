import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { sep } from '@tauri-apps/api/path'
import { useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  assetId: string
  absolutePath: string
}

type ReturnProps = {
  openInFileManager: () => Promise<void>
  deleteEntry: () => Promise<void>
  openButtonCheckMarked: boolean
  isDeleting: boolean
  isDeleted: boolean
}

export const useDirEntryRow = ({
  assetId,
  absolutePath,
}: Props): ReturnProps => {
  const [openButtonCheckMarked, setOpenButtonCheckMarked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  const openInFileManager = async () => {
    const result = await commands.openFileInFileManager(absolutePath)

    if (result.status === 'ok') {
      setOpenButtonCheckMarked(true)

      setTimeout(() => {
        setOpenButtonCheckMarked(false)
      }, 1000)
    } else {
      toast({
        title: t('general:error'),
        description: result.error,
      })
    }
  }

  const deleteEntry = async () => {
    try {
      setIsDeleting(true)

      const entryName = absolutePath.split(sep()).pop()!
      const result = await commands.deleteEntryFromAssetDataDir(
        assetId,
        entryName,
      )

      if (result.status === 'ok') {
        setIsDeleted(true)
      } else {
        toast({
          title: t('general:error'),
          description: result.error,
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    openInFileManager,
    deleteEntry,
    openButtonCheckMarked,
    isDeleting,
    isDeleted,
  }
}
