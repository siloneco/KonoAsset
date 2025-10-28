import { useEffect, useState } from 'react'
import { TabType } from '..'

const TAB_ORDER: Record<TabType, number> = {
  appearance: 0,
  path: 1,
  details: 2,
}

type ReturnProps = {
  tab: TabType
  handleTabChange: (newTab: TabType) => void
  getTabContentStyleProps: {
    currentTab: TabType
    previousTab: TabType | null
    isAnimating: boolean
    isGoingForward: boolean
  }
}

export const useAnimatedSetup = (): ReturnProps => {
  const [tab, setTab] = useState<TabType>('appearance')
  const [previousTab, setPreviousTab] = useState<TabType | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGoingForward, setIsGoingForward] = useState(true)

  const handleTabChange = (newTab: TabType) => {
    if (newTab !== tab && !isAnimating) {
      setIsAnimating(true)
      setPreviousTab(tab)
      setIsGoingForward(TAB_ORDER[newTab] > TAB_ORDER[tab])
      setTab(newTab)
    }
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setPreviousTab(null)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  const getTabContentStyleProps = {
    currentTab: tab,
    previousTab: previousTab,
    isAnimating: isAnimating,
    isGoingForward: isGoingForward,
  }

  return {
    tab,
    handleTabChange,
    getTabContentStyleProps,
  }
}
