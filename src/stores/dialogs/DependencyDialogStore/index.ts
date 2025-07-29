import { AssetDescription, AssetSummary } from '@/lib/bindings'
import { create } from 'zustand'
import { fetchDependencies } from './logic'

type CurrentAssetType = Pick<AssetSummary, 'id'> &
  Pick<AssetDescription, 'name'> & {
    dependencies: AssetSummary[]
  }

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  open: (assetId: string) => void

  currentAsset: CurrentAssetType | null
}

export const useDependencyDialogStore = create<Props>((set) => ({
  isOpen: false,
  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },
  open: (assetId: string) => {
    // currentAsset を null にして loading 状態にする
    set({ isOpen: true, currentAsset: null })

    fetchDependencies(assetId)
      .then((asset) => {
        set({ currentAsset: asset })
      })
      .catch((error) => {
        console.error(
          'Failed to fetch dependency assets for dependency dialog:',
          error,
        )
      })
  },
  currentAsset: null,
}))
