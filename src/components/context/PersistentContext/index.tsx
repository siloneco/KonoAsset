import { createContext, FC } from 'react'
import { usePersistentContext } from './hook'
import { SortBy } from '@/lib/bindings'

export type AssetCardSize = 'Small' | 'Medium' | 'Large' | 'List'

export type PersistentContextType = {
  sortBy: SortBy
  setSortBy: (sortBy: SortBy) => void
  reverseOrder: boolean
  setReverseOrder: (reverseOrder: boolean) => void

  assetCardSize: AssetCardSize
  setAssetCardSize: (size: AssetCardSize) => void
}

export const PersistentContext = createContext<PersistentContextType>({
  sortBy: 'CreatedAt',
  setSortBy: () => {},
  reverseOrder: false,
  setReverseOrder: () => {},

  assetCardSize: 'Medium',
  setAssetCardSize: () => {},
})

type Props = {
  children: React.ReactNode
}

export const PersistentContextProvider: FC<Props> = ({ children }) => {
  const { persistentContextValue } = usePersistentContext()

  return (
    <PersistentContext.Provider value={persistentContextValue}>
      {children}
    </PersistentContext.Provider>
  )
}
