import {
  AssetRegistrationStatistics,
  AssetVolumeStatistics,
  commands,
  events,
} from '@/lib/bindings'
import { UnlistenFn } from '@tauri-apps/api/event'
import { useEffect, useState, useRef } from 'react'

type ReturnProps = {
  assetRegistrationAreaChartData: AssetRegistrationStatistics[]
  assetVolumeStatistics: AssetVolumeStatistics[]
  loadingAssetVolumeStatistics: boolean

  total: number
  avatars: number
  avatarWearables: number
  worldObjects: number
}

const useThrottle = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdateTime = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    if (now - lastUpdateTime.current >= delay) {
      setThrottledValue(value)
      lastUpdateTime.current = now
    } else {
      const timeoutId = setTimeout(
        () => {
          setThrottledValue(value)
          lastUpdateTime.current = Date.now()
        },
        delay - (now - lastUpdateTime.current),
      )
      return () => clearTimeout(timeoutId)
    }
  }, [value, delay])

  return throttledValue
}

export const useStatisticsTab = (): ReturnProps => {
  const [assetRegistrationAreaChartData, setAssetRegistrationAreaChartData] =
    useState<AssetRegistrationStatistics[]>([])
  const [assetVolumeStatistics, setAssetVolumeStatistics] = useState<
    AssetVolumeStatistics[]
  >([])
  const [loadingAssetVolumeStatistics, setLoadingAssetVolumeStatistics] =
    useState(true)

  const [avatars, setAvatars] = useState(0)
  const [avatarWearables, setAvatarWearables] = useState(0)
  const [worldObjects, setWorldObjects] = useState(0)

  const throttledAssetVolumeStatistics = useThrottle(
    assetVolumeStatistics,
    1000,
  )

  const fetchRegistrationStatistics = async () => {
    const result = await commands.getRegistrationStatistics()

    if (result.status === 'ok') {
      setAssetRegistrationAreaChartData(result.data)

      if (result.data.length > 0) {
        const lastIndex = result.data.length - 1

        setAvatars(result.data[lastIndex].avatars)
        setAvatarWearables(result.data[lastIndex].avatarWearables)
        setWorldObjects(result.data[lastIndex].worldObjects)
      }
    }
  }

  useEffect(() => {
    fetchRegistrationStatistics()
  }, [])

  const mergeVolumeStatistics = (data: AssetVolumeStatistics[]) => {
    setAssetVolumeStatistics((prev) => {
      // Create a map to track unique IDs
      const idMap = new Map<string, AssetVolumeStatistics>()

      // Add previous items to the map
      prev.forEach((item) => {
        idMap.set(item.id, item)
      })

      // Add or update with new data, overwriting any duplicates
      data.forEach((item) => {
        idMap.set(item.id, item)
      })

      // Convert map values back to array and sort
      const newData = Array.from(idMap.values())
      newData.sort((a, b) => b.sizeInBytes - a.sizeInBytes)

      return newData
    })
  }

  useEffect(() => {
    let isCancelled = false
    let unlistenCompleteFn: UnlistenFn | undefined = undefined

    const setupListener = async () => {
      unlistenCompleteFn = await events.assetVolumeEstimatedEvent.listen(
        (e) => {
          if (isCancelled) return

          const type = e.payload.type
          const data = e.payload.data

          if (type === 'Chunk') {
            mergeVolumeStatistics(data)
          } else if (type === 'Completed') {
            setAssetVolumeStatistics(
              data.sort((a, b) => b.sizeInBytes - a.sizeInBytes),
            )
            setLoadingAssetVolumeStatistics(false)
          }
        },
      )

      if (isCancelled) {
        unlistenCompleteFn()
        return
      }

      const taskExecutionResult =
        await commands.executeVolumeStatisticsCalculationTask()

      if (taskExecutionResult.status === 'error') {
        console.error(taskExecutionResult.error)
        return
      }

      const result = await commands.getVolumeStatisticsCache()

      if (result.status === 'ok' && result.data !== null) {
        setAssetVolumeStatistics(
          result.data.sort((a, b) => b.sizeInBytes - a.sizeInBytes),
        )
        setLoadingAssetVolumeStatistics(false)
        return
      }
    }

    setupListener()

    return () => {
      isCancelled = true
      unlistenCompleteFn?.()
    }
  }, [])

  return {
    assetRegistrationAreaChartData,
    assetVolumeStatistics: throttledAssetVolumeStatistics,
    loadingAssetVolumeStatistics,
    total: avatars + avatarWearables + worldObjects,
    avatars,
    avatarWearables,
    worldObjects,
  }
}
