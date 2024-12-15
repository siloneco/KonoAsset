import { createContext } from 'react'
import {
  AssetType,
  AvatarAsset,
  AvatarRelatedAssets,
  WorldRelatedAssets,
} from '@/lib/entity'

export type AssetContextType = {
  avatarAssets: AvatarAsset[]
  setAvatarAssets: (assets: AvatarAsset[]) => void
  addAvatarAsset: (asset: AvatarAsset) => void
  deleteAvatarAsset: (id: string) => void

  avatarRelatedAssets: AvatarRelatedAssets[]
  setAvatarRelatedAssets: (assets: AvatarRelatedAssets[]) => void
  addAvatarRelatedAsset: (asset: AvatarRelatedAssets) => void
  deleteAvatarRelatedAsset: (id: string) => void

  worldAssets: WorldRelatedAssets[]
  setWorldAssets: (assets: WorldRelatedAssets[]) => void
  addWorldAsset: (asset: WorldRelatedAssets) => void
  deleteWorldAsset: (id: string) => void

  refreshAssets: (assetType?: AssetType) => Promise<void>
}

export const AssetContext = createContext<AssetContextType>({
  avatarAssets: [],
  setAvatarAssets: () => {},
  addAvatarAsset: () => {},
  deleteAvatarAsset: () => {},

  avatarRelatedAssets: [],
  setAvatarRelatedAssets: () => {},
  addAvatarRelatedAsset: () => {},
  deleteAvatarRelatedAsset: () => {},

  worldAssets: [],
  setWorldAssets: () => {},
  addWorldAsset: () => {},
  deleteWorldAsset: () => {},

  refreshAssets: async () => {},
})
