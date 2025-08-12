import { AssetDescription, AssetSummary } from '@/lib/bindings'
import { create } from 'zustand'
import { fetchAssetInfo } from './logic'

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  open: (assetId: string) => void

  currentAsset:
    | (Pick<AssetSummary, 'id'> & Pick<AssetDescription, 'name' | 'memo'>)
    | null
}

export const useMemoDialogStore = create<Props>((set) => ({
  isOpen: false,
  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },
  open: (assetId: string) => {
    // currentAsset を null にして loading 状態にする
    set({ isOpen: true, currentAsset: null })

    fetchAssetInfo(assetId)
      .then((asset) => {
        set({ currentAsset: asset })
      })
      .catch((error) => {
        console.error('Failed to fetch asset info for memo dialog:', error)
      })
  },
  currentAsset: null,
}))
