import { FileInfo } from '@/lib/bindings'
import { create } from 'zustand'

type UnitypackageFiles = { [x: string]: FileInfo[] }

type Props = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  open: (assetId: string, unitypackageFiles: UnitypackageFiles) => void

  assetId: string | null
  unitypackageFiles: UnitypackageFiles | null
}

export const useUnitypackageSelectDialogStore = create<Props>((set) => ({
  isOpen: false,
  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },
  open: (assetId: string, unitypackageFiles: UnitypackageFiles) => {
    set({
      isOpen: true,
      assetId: assetId,
      unitypackageFiles: unitypackageFiles,
    })
  },
  assetId: null,
  unitypackageFiles: null,
}))
