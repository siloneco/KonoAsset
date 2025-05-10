import { useEffect, useState, useRef } from 'react'

export const useThrottle = <T>(value: T, delay: number): T => {
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
