import { useToast } from '@/hooks/use-toast'
import { commands } from '@/lib/bindings'
import { sep } from '@tauri-apps/api/path'
import { useCallback, useMemo, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type DeletePhase = 'initial' | 'deleting' | 'deleted'

type Props = {
  assetId: string
  absolutePath: string
  filename: string
  type: 'directory' | 'file'
}

type ReturnProps = {
  displayName: string
  openInFileManager: () => Promise<void>
  deleteEntry: () => Promise<void>
  openButtonChecked: boolean
  deletePhase: DeletePhase
}

export const useDirEntryRow = ({
  assetId,
  absolutePath,
  filename,
  type,
}: Props): ReturnProps => {
  const [openButtonChecked, setOpenButtonChecked] = useState(false)
  const [deletePhase, setDeletePhase] = useState<DeletePhase>('initial')

  const { t } = useLocalization()
  const { toast } = useToast()

  const displayName = useMemo(
    () => `${filename}${type === 'directory' ? '/' : ''}`,
    [filename, type],
  )

  const openInFileManager = useCallback(async () => {
    const result = await commands.openFileInFileManager(absolutePath)

    if (result.status === 'ok') {
      setOpenButtonChecked(true)

      setTimeout(() => {
        setOpenButtonChecked(false)
      }, 1000)
    } else {
      toast({
        title: t('general:error'),
        description: result.error,
      })
    }
  }, [absolutePath, t, toast])

  const deleteEntry = useCallback(async () => {
    setDeletePhase('deleting')

    const entryName = absolutePath.split(sep()).pop()!
    const result = await commands.deleteEntryFromAssetDataDir(
      assetId,
      entryName,
    )

    if (result.status === 'ok') {
      setDeletePhase('deleted')
    } else {
      toast({
        title: t('general:error'),
        description: result.error,
      })
      setDeletePhase('initial')
    }
  }, [absolutePath, assetId, t, toast])

  return {
    displayName,
    openInFileManager,
    deleteEntry,
    openButtonChecked,
    deletePhase,
  }
}
