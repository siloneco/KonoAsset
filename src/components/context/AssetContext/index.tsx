import { createContext, FC } from 'react'
import { useAssetContext } from './hook'

export type AssetContextType = {
  filteredIds: string[] | null
  setFilteredIds: (filteredIds: string[] | null) => void
}

export const AssetContext = createContext<AssetContextType>({
  filteredIds: null,
  setFilteredIds: () => {},
})

type Props = {
  children: React.ReactNode
}

export const AssetContextProvider: FC<Props> = ({ children }) => {
  const { value } = useAssetContext()

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}
