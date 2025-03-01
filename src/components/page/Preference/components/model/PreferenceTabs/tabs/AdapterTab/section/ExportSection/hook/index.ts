import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'

type ExportStyle = 'KonoAsset' | 'HumanReadable'

type ReturnProps = {
  currentExportType: ExportStyle | null
  setExportType: (type: ExportStyle) => void
  exportDestination: string | null
  selectExportDestination: () => Promise<void>
  exportButtonActivated: boolean
}

export const useExportSection = (): ReturnProps => {
  const [currentExportType, setCurrentExportType] =
    useState<ExportStyle | null>(null)
  const [exportDestination, setExportDestination] = useState<string | null>(
    null,
  )

  const selectExportDestination = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    })

    if (dir === null) {
      return
    }

    setExportDestination(dir)
  }

  const exportButtonActivated =
    currentExportType !== null && exportDestination !== null

  return {
    currentExportType,
    setExportType: setCurrentExportType,
    exportDestination,
    selectExportDestination,
    exportButtonActivated,
  }
}
