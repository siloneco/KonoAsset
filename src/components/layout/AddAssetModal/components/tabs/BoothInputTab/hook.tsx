import { commands } from '@/lib/bindings'
import { extractBoothItemId } from '@/lib/utils'
import { useState, useContext, ChangeEvent } from 'react'
import { AddAssetModalContext } from '../../..'
import { sep } from '@tauri-apps/api/path'
import { AssetFormType } from '@/lib/form'
import { useToast } from '@/hooks/use-toast'

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
}

type ReturnProps = {
  newAssetFilename: string
  getAssetDescriptionFromBooth: () => Promise<void>
  onUrlInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  fetching: boolean
  boothUrlInput: string
  moveToNextTab: () => void
  backToPreviousTab: () => void
}

export const useBoothInputTab = ({ form, setTab }: Props): ReturnProps => {
  const [boothUrlInput, setBoothUrlInput] = useState('')
  const [boothItemId, setBoothItemId] = useState<number | null>(null)
  const [fetching, setFetching] = useState(false)

  const { toast } = useToast()

  const { assetPath, setDuplicateWarningItems } =
    useContext(AddAssetModalContext)

  const backToPreviousTab = () => {
    setTab('selector')
  }

  const moveToNextTab = () => {
    setTab('asset-type-selector')
  }

  const moveToDuplicationWarning = () => {
    setTab('duplicate-warning')
  }

  const getAssetDescriptionFromBooth = async () => {
    if (fetching || boothItemId === null) {
      return
    }

    try {
      setFetching(true)

      const result = await commands.getAssetDescriptionFromBooth(boothItemId)

      if (result.status === 'error') {
        console.error(result.error)
        toast({
          title: '取得に失敗しました',
          description: result.error,
        })
        return
      }

      const data = result.data

      const description = data.description

      form.setValue('name', description.name)
      form.setValue('creator', description.creator)
      form.setValue('imageFilename', description.imageFilename)
      form.setValue('publishedAt', description.publishedAt)
      form.setValue('boothItemId', boothItemId)
      form.setValue('assetType', data.estimatedAssetType ?? 'Avatar')

      const duplicationCheckResult =
        await commands.getAssetDisplaysByBoothId(boothItemId)

      if (duplicationCheckResult.status === 'ok') {
        const duplicationCheckData = duplicationCheckResult.data

        if (duplicationCheckData.length > 0) {
          setDuplicateWarningItems(duplicationCheckData)
          moveToDuplicationWarning()
          return
        }
      }

      if (duplicationCheckResult.status === 'error') {
        console.error(duplicationCheckResult.error)
      }

      moveToNextTab()
    } finally {
      setFetching(false)
    }
  }

  const onUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setBoothUrlInput(url)

    const extractIdResult = extractBoothItemId(url)
    if (extractIdResult.status === 'ok') {
      setBoothItemId(extractIdResult.data)
    } else {
      setBoothItemId(null)
    }
  }

  const newAssetFilename =
    assetPath !== undefined
      ? (assetPath.split(sep()).pop() as string)
      : 'ファイルが選択されていません！'

  return {
    newAssetFilename,
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
    moveToNextTab,
    backToPreviousTab,
  }
}
