import { events } from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'

type ReturnProps = {
  filename: string
  progress: number
}

export const useProgressEvent = (): ReturnProps => {
  const [filename, setFilename] = useState<string>('')
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    let isCancelled = false
    let unlistenEvent: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      try {
        unlistenEvent = await events.progressEvent.listen((e) => {
          if (isCancelled) return

          setProgress(e.payload.percentage)
          setFilename(e.payload.filename)
        })

        if (isCancelled) {
          unlistenEvent()
          return
        }
      } catch (error) {
        console.error('Failed to listen to ProgressEvent:', error)
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenEvent?.()
    }
  }, [setFilename, setProgress])

  return {
    filename,
    progress,
  }
}
