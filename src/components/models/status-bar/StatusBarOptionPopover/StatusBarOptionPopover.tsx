import { FC } from 'react'
import { useStatusBarOptionPopover } from './hook'
import { InternalStatusBarOptionPopover } from './internal/InternalStatusBarOptionPopover'

export const StatusBarOptionPopover: FC = () => {
  const { displayLayoutValue, sortValue, setSort, setDisplayLayout } =
    useStatusBarOptionPopover()

  return (
    <InternalStatusBarOptionPopover
      displayLayoutValue={displayLayoutValue}
      sortValue={sortValue}
      setSort={setSort}
      setDisplayLayout={setDisplayLayout}
    />
  )
}
