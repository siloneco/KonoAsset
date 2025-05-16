import { useCallback, useEffect, useState } from 'react'
import {
  DragDropContextType,
  DragDropHandlingFn,
  DragDropRegisterConfig,
} from '..'
import { UnlistenFn } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

type StateType = {
  config: DragDropRegisterConfig
  fn: DragDropHandlingFn
}

type ReturnProps = {
  dragDropContextValue: DragDropContextType
}

const DEFAULT_PRIORITY = 100

export const useDragDropContext = (): ReturnProps => {
  const [fnList, setFnList] = useState<StateType[]>([])

  const register = useCallback(
    (config: DragDropRegisterConfig, fn: DragDropHandlingFn) => {
      const { uniqueId } = config

      setFnList((prev) => {
        const newFnList = [...prev]

        const existingIndex = newFnList.findIndex(
          (item) => item.config.uniqueId === uniqueId,
        )

        if (existingIndex !== -1) {
          newFnList[existingIndex] = { config, fn }
        } else {
          newFnList.push({ config, fn })
        }

        newFnList.sort((a, b) => {
          if (a.config.priority === b.config.priority) {
            return a.config.uniqueId.localeCompare(b.config.uniqueId)
          }
          return (
            (a.config.priority ?? DEFAULT_PRIORITY) -
            (b.config.priority ?? DEFAULT_PRIORITY)
          )
        })

        return newFnList
      })
    },
    [setFnList],
  )

  useEffect(() => {
    let isCancelled = false
    let unlistenFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      unlistenFn = await getCurrentWindow().onDragDropEvent(async (event) => {
        if (isCancelled) return

        for (const item of fnList) {
          const { fn } = item

          const stopPropagation = await fn(event)

          if (stopPropagation) {
            break
          }
        }
      })

      if (isCancelled) {
        unlistenFn()
        return
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenFn?.()
    }
  }, [fnList, setFnList])

  const dragDropContextValue: DragDropContextType = {
    register,
  }

  return {
    dragDropContextValue,
  }
}
