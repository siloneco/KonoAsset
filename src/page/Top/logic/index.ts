import { commands, FileInfo, Result } from '@/lib/bindings'
import { convertFileSrc } from '@tauri-apps/api/core'
import { Event } from '@tauri-apps/api/event'
import { DragDropEvent } from '@tauri-apps/api/webview'

export const onFileDrop = (
  event: Event<DragDropEvent>,
  setDragAndHover: (isDragAndHover: boolean) => void,
) => {
  if (event.payload.type == 'over') {
    return
  }

  if (event.payload.type == 'enter') {
    setDragAndHover(true)
  } else {
    setDragAndHover(false)
  }
}

type Props = {
  assetId: string
  onError: (error: string) => void
  hasDependencies: boolean
  showDependencyWarning: () => void
  openSelectUnitypackageDialog: (
    assetId: string,
    data: { [x: string]: FileInfo[] },
  ) => void
}

export const onMainOpenButtonClick = async ({
  assetId,
  onError,
  hasDependencies,
  showDependencyWarning,
  openSelectUnitypackageDialog,
}: Props): Promise<boolean> => {
  const result = await commands.listUnitypackageFiles(assetId)

  if (result.status === 'error') {
    onError(result.error)
    return false
  }

  const data = result.data
  Object.keys(data).forEach(
    (key) => data[key] === undefined && delete data[key],
  )

  const impartialData = data as { [x: string]: FileInfo[] }

  if (Object.keys(data).length === 0) {
    const result = await commands.openManagedDir(assetId)

    if (result.status === 'error') {
      onError(result.error)
      return false
    }

    return true
  }

  if (
    Object.keys(impartialData).length === 1 &&
    Object.values(impartialData)[0].length === 1
  ) {
    const item = Object.values(impartialData)[0][0]

    const result = await commands.openFileInFileManager(item.absolutePath)

    if (result.status === 'error') {
      onError(result.error)
      return false
    }

    if (hasDependencies) {
      showDependencyWarning()
    }

    return true
  }

  if (hasDependencies) {
    showDependencyWarning()
  }

  openSelectUnitypackageDialog(assetId, impartialData)
  return false
}

export const resolveImageAbsolutePath = async (
  filename: string,
): Promise<Result<string, string>> => {
  const result = await commands.getImageAbsolutePath(filename)

  if (result.status === 'error') {
    return result
  }

  return {
    status: 'ok',
    data: convertFileSrc(result.data),
  }
}
