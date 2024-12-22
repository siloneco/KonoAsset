import { invoke } from '@tauri-apps/api/core'
import { downloadDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'

type Props = {
  setPath?: (path: string) => void
}

type ReturnProps = {
  selectImage: () => Promise<void>
}

export const useImagePicker = ({ setPath }: Props): ReturnProps => {
  const openImageSelector = async () => {
    if (setPath === undefined) {
      return
    }

    const path = await open({
      multiple: false,
      directory: false,
      defaultPath: await downloadDir(),
      filters: [{ name: '画像', extensions: ['png', 'jpg', 'jpeg'] }],
    })

    if (path === null) {
      return
    }

    const result: string = await invoke('copy_image_file_to_images', {
      path,
      temporary: true,
    })

    setPath(result)
  }

  return {
    selectImage: openImageSelector,
  }
}
