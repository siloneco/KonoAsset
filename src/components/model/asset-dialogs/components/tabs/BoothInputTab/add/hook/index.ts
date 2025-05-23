import { convertToBoothURL, extractBoothItemId } from '@/lib/utils'
import { useState, useContext, ChangeEvent } from 'react'
import { AddAssetDialogContext } from '../../../../../AddAssetDialog'
import { sep } from '@tauri-apps/api/path'
import { AssetFormType } from '@/lib/form'
import { useToast } from '@/hooks/use-toast'
import { getAndSetAssetInfoFromBoothToForm } from '../../logic'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
  setImageUrls: (imageUrls: string[]) => void
}

type ReturnProps = {
  representativeImportFilename: string
  importFileCount: number
  getAssetDescriptionFromBooth: () => Promise<void>
  onUrlInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  fetching: boolean
  boothUrlInput: string
  moveToNextTab: () => void
  backToPreviousTab: () => void
}

export const useBoothInputTabForAddDialog = ({
  form,
  setTab,
  setImageUrls,
}: Props): ReturnProps => {
  const formBoothItemId = form.getValues('boothItemId')
  const formBoothUrl =
    formBoothItemId !== null ? convertToBoothURL(formBoothItemId) : ''

  const [boothItemId, setBoothItemId] = useState(formBoothItemId)
  const [boothUrlInput, setBoothUrlInput] = useState(formBoothUrl)
  const [fetching, setFetching] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  const { assetPaths, setDuplicateWarningItems } = useContext(
    AddAssetDialogContext,
  )

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

      const result = await getAndSetAssetInfoFromBoothToForm({
        boothItemId: boothItemId,
        form: form,
        setImageUrls,
      })

      if (result.status === 'ok') {
        const data = result.data

        if (data.goNext) {
          moveToNextTab()
        } else if (data.duplicated) {
          setDuplicateWarningItems(data.duplicatedItems)
          moveToDuplicationWarning()
        }
      } else {
        toast({
          title: t('addasset:booth-input:failed-to-get-info'),
          description: result.error,
        })
      }
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

  const representativeImportFilename =
    assetPaths !== undefined && assetPaths.length > 0
      ? (assetPaths[0].split(sep()).pop() as string)
      : t('addasset:booth-input:no-file-selected')

  const importFileCount = assetPaths !== undefined ? assetPaths.length : 0

  return {
    representativeImportFilename,
    importFileCount,
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
    moveToNextTab,
    backToPreviousTab,
  }
}
