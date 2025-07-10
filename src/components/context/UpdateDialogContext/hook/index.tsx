import { useCallback, useState, useRef, useEffect } from 'react'
import { checkForUpdate, dismissUpdate, downloadUpdate } from '../logic'

const ANIMATION_DURATION_MS = 300

type ReturnProps = {
  updateDialogOpen: boolean
  setUpdateDialogOpen: (open: boolean) => void
  updateDownloadTaskId: string | null
  checkForUpdate: () => Promise<void>
  updateNotificationVisible: boolean
  setUpdateNotificationVisible: (visible: boolean) => void
  startUpdateDownloadingAndOpenDialog: () => Promise<void>
  dismissUpdateNotification: () => void
  isNotificationClosing: boolean
}

export const useUpdateDialogContext = (): ReturnProps => {
  const [updateDownloadTaskId, setUpdateDownloadTaskId] = useState<
    string | null
  >(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [updateNotificationVisible, setUpdateNotificationVisible] =
    useState(false)
  const [isNotificationClosing, setIsNotificationClosing] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const startUpdateDownloadingAndOpenDialog = useCallback(async () => {
    await downloadUpdate(setUpdateDownloadTaskId)

    setUpdateDialogOpen(true)
    setIsNotificationClosing(true)

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = setTimeout(() => {
      setUpdateNotificationVisible(false)
      setIsNotificationClosing(false)
      closeTimeoutRef.current = null
    }, ANIMATION_DURATION_MS)
  }, [setUpdateDownloadTaskId, setUpdateDialogOpen])

  const dismissUpdateNotification = useCallback(() => {
    dismissUpdate()

    setIsNotificationClosing(true)

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = setTimeout(() => {
      setUpdateNotificationVisible(false)
      setIsNotificationClosing(false)
      closeTimeoutRef.current = null
    }, ANIMATION_DURATION_MS)
  }, [])

  const executeUpdateCheck = useCallback(async () => {
    const updateAvailable = await checkForUpdate()

    if (!updateAvailable) {
      return
    }

    setUpdateNotificationVisible(true)
    setIsNotificationClosing(false)
  }, [])

  return {
    updateDialogOpen,
    setUpdateDialogOpen,
    updateDownloadTaskId,
    checkForUpdate: executeUpdateCheck,
    updateNotificationVisible,
    setUpdateNotificationVisible,
    startUpdateDownloadingAndOpenDialog,
    dismissUpdateNotification,
    isNotificationClosing,
  }
}
