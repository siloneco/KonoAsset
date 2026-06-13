import { FC } from 'react'
import { convertTabToIndex } from './logic'
import { cn } from '@/lib/utils'

const BASE_BUTTON_CLASS = 'size-3 rounded-full bg-primary/40 cursor-pointer'

type Props = {
  animationCSSProperties?: string
  currentTab: 'appearance' | 'path' | 'details'
  setTab: (tab: 'appearance' | 'path' | 'details') => void
}

export const Pagination: FC<Props> = ({
  animationCSSProperties,
  currentTab,
  setTab,
}) => {
  const currentTabIndex = convertTabToIndex(currentTab)

  return (
    <div
      className="w-full flex justify-center gap-2 mt-4 overflow-hidden h-0"
      style={{
        animation: animationCSSProperties,
      }}
    >
      <PaginationButton
        currentTabIndex={currentTabIndex}
        tab="appearance"
        setTab={setTab}
      />
      <PaginationButton
        currentTabIndex={currentTabIndex}
        tab="path"
        setTab={setTab}
      />
      <PaginationButton
        currentTabIndex={currentTabIndex}
        tab="details"
        setTab={setTab}
      />
    </div>
  )
}

const PaginationButton: FC<{
  currentTabIndex: number
  tab: 'appearance' | 'path' | 'details'
  setTab: (tab: 'appearance' | 'path' | 'details') => void
}> = ({ currentTabIndex, tab, setTab }) => {
  return (
    <div
      className={cn(
        BASE_BUTTON_CLASS,
        currentTabIndex >= convertTabToIndex(tab) && 'bg-primary',
        currentTabIndex + 1 < convertTabToIndex(tab) && 'cursor-not-allowed',
      )}
      onClick={() => {
        if (currentTabIndex + 1 >= convertTabToIndex(tab)) {
          setTab(tab)
        }
      }}
    />
  )
}
