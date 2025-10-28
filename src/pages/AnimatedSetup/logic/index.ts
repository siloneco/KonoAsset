import { TabType } from '..'

type GetTabContentStyleProps = {
  tabValue: TabType
  currentTab: TabType
  previousTab: TabType | null
  isAnimating: boolean
  isGoingForward: boolean
}

export const getTabContentStyle = ({
  tabValue,
  currentTab,
  previousTab,
  isAnimating,
  isGoingForward,
}: GetTabContentStyleProps) => {
  if (previousTab === tabValue && isAnimating) {
    // Outgoing tab
    const outgoingAnimation = isGoingForward
      ? 'tab-slide-out-left 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      : 'tab-slide-out-right 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    return {
      animation: outgoingAnimation,
      position: 'absolute' as const,
      inset: 0,
    }
  }
  if (currentTab === tabValue && isAnimating) {
    // Incoming tab
    const incomingAnimation = isGoingForward
      ? 'tab-slide-in-right 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      : 'tab-slide-in-left 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards'
    return {
      animation: incomingAnimation,
    }
  }
  if (currentTab === tabValue && !isAnimating) {
    // Normal state - just render current tab
    return {}
  }
  // Hidden state
  return { display: 'none' }
}
