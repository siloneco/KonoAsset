import { useState, useEffect, useContext, useCallback } from 'react'
import {
  onFileDrop,
  onMainOpenButtonClick,
  resolveImageAbsolutePath,
} from '../logic'
import {
  DragDropContext,
  DragDropRegisterConfig,
} from '@/components/context/DragDropContext'
import { UpdateDialogContext } from '@/components/context/UpdateDialogContext'
import { useToast } from '@/hooks/use-toast'
import { useLocalization } from '@/hooks/use-localization'
import { OctagonAlert } from 'lucide-react'
import { FileInfo, Result } from '@/lib/bindings'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'

type ReturnProps = {
  isDragAndHover: boolean

  onMainOpenButtonClick: (assetId: string) => Promise<boolean>
  openAddAssetDialog: () => void
  openDirEditDialog: (assetId: string) => Promise<void>
  openEditAssetDialog: (assetId: string) => Promise<void>
  openMemoDialog: (assetId: string) => Promise<void>
  openDependencyDialog: (assetId: string) => Promise<void>

  addAssetDialogOpen: boolean
  setAddAssetDialogOpen: (open: boolean) => void

  editAssetDialogAssetId: string | null
  editAssetDialogOpen: boolean
  setEditAssetDialogOpen: (open: boolean) => void

  dataManagementDialogAssetId: string | null
  dataManagementDialogOpen: boolean
  setDataManagementDialogOpen: (open: boolean) => void

  memoDialogAssetId: string | null
  memoDialogOpen: boolean
  setMemoDialogOpen: (open: boolean) => void

  dependencyDialogAssetId: string | null
  dependencyDialogOpen: boolean
  setDependencyDialogOpen: (open: boolean) => void

  selectUnitypackageDialogAssetId: string | null
  selectUnitypackageDialogOpen: boolean
  setSelectUnitypackageDialogOpen: (open: boolean) => void
  unitypackageFiles: {
    [x: string]: FileInfo[]
  }

  resolveImageAbsolutePath: (
    filename: string,
  ) => Promise<Result<string, string>>
}

export const useTopPage = (): ReturnProps => {
  const [isDragAndHover, setDragAndHover] = useState(false)

  const [addAssetDialogOpen, setAddAssetDialogOpen] = useState(false)

  const [editAssetDialogAssetId, setEditAssetDialogAssetId] = useState<
    string | null
  >(null)
  const [editAssetDialogOpen, setEditAssetDialogOpen] = useState(false)

  const [dataManagementDialogAssetId, setDataManagementDialogAssetId] =
    useState<string | null>(null)
  const [dataManagementDialogOpen, setDataManagementDialogOpen] =
    useState(false)

  const [memoDialogAssetId, setMemoDialogAssetId] = useState<string | null>(
    null,
  )
  const [memoDialogOpen, setMemoDialogOpen] = useState(false)

  const [dependencyDialogAssetId, setDependencyDialogAssetId] = useState<
    string | null
  >(null)
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false)

  const [selectUnitypackageDialogAssetId, setSelectUnitypackageDialogAssetId] =
    useState<string | null>(null)
  const [selectUnitypackageDialogOpen, setSelectUnitypackageDialogOpen] =
    useState(false)
  const [unitypackageFiles, setUnitypackageFiles] = useState<{
    [x: string]: FileInfo[]
  }>({})

  const { register } = useContext(DragDropContext)
  const { checkForUpdate } = useContext(UpdateDialogContext)
  const { sortedAssetSummaries } = useAssetSummaryStore()

  const { toast } = useToast()
  const { t } = useLocalization()

  useEffect(() => {
    const config: DragDropRegisterConfig = {
      uniqueId: 'top-page',
      priority: 0,
    }

    register(config, async (event) => {
      onFileDrop(event, setDragAndHover)
      return false
    })
  }, [register])

  useEffect(() => {
    checkForUpdate()
  }, [checkForUpdate])

  const onMainOpenButtonClickProp = useCallback(
    async (assetId: string) => {
      const hasDependencies = sortedAssetSummaries.some(
        (asset) => asset.id === assetId && asset.dependencies.length > 0,
      )

      return await onMainOpenButtonClick({
        assetId,
        hasDependencies,
        onError: (error) => {
          toast({
            title: t('general:error'),
            description: error,
          })
        },
        showDependencyWarning: () => {
          toast({
            icon: <OctagonAlert className="text-primary" />,
            title: t('assetcard:open-button:show-dependency-warning-toast'),
            description: t(
              'assetcard:open-button:show-dependency-warning-toast:description',
            ),
            duration: 5000,
          })
        },
        openSelectUnitypackageDialog: (
          assetId: string,
          data: {
            [x: string]: FileInfo[]
          },
        ) => {
          setSelectUnitypackageDialogOpen(true)
          setSelectUnitypackageDialogAssetId(assetId)
          setUnitypackageFiles(data)
        },
      })
    },
    [toast, t, sortedAssetSummaries],
  )

  const openEditAssetDialog = useCallback(
    async (assetId: string) => {
      setEditAssetDialogAssetId(assetId)
      setEditAssetDialogOpen(true)
    },
    [setEditAssetDialogAssetId, setEditAssetDialogOpen],
  )

  const openAddAssetDialog = useCallback(() => {
    setAddAssetDialogOpen(true)
  }, [setAddAssetDialogOpen])

  const openDirEditDialog = useCallback(
    async (assetId: string) => {
      setDataManagementDialogAssetId(assetId)
      setDataManagementDialogOpen(true)
    },
    [setDataManagementDialogAssetId, setDataManagementDialogOpen],
  )

  const openMemoDialog = useCallback(
    async (assetId: string) => {
      setMemoDialogAssetId(assetId)
      setMemoDialogOpen(true)
    },
    [setMemoDialogAssetId, setMemoDialogOpen],
  )

  const openDependencyDialog = useCallback(
    async (assetId: string) => {
      setDependencyDialogAssetId(assetId)
      setDependencyDialogOpen(true)
    },
    [setDependencyDialogAssetId, setDependencyDialogOpen],
  )

  return {
    isDragAndHover,

    onMainOpenButtonClick: onMainOpenButtonClickProp,
    openAddAssetDialog,
    openDirEditDialog,
    openEditAssetDialog,
    openMemoDialog,
    openDependencyDialog,

    addAssetDialogOpen,
    setAddAssetDialogOpen,

    editAssetDialogAssetId,
    editAssetDialogOpen,
    setEditAssetDialogOpen,

    dataManagementDialogAssetId,
    dataManagementDialogOpen,
    setDataManagementDialogOpen,

    memoDialogAssetId,
    memoDialogOpen,
    setMemoDialogOpen,

    dependencyDialogAssetId,
    dependencyDialogOpen,
    setDependencyDialogOpen,

    selectUnitypackageDialogAssetId,
    selectUnitypackageDialogOpen,
    setSelectUnitypackageDialogOpen,
    unitypackageFiles,

    resolveImageAbsolutePath,
  }
}
