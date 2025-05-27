import { convertToBoothURL, extractBoothItemId } from '@/lib/booth'
import { useState, ChangeEvent, useContext } from 'react'
import { AssetFormType } from '@/lib/form'
import { useToast } from '@/hooks/use-toast'
import { getAndSetAssetInfoFromBoothToForm } from '../../logic'
import { useLocalization } from '@/hooks/use-localization'
import { PreferenceContext } from '@/components/context/PreferenceContext'

type Props = {
  form: AssetFormType
  goToNextTab: () => void
  setImageUrls: (imageUrls: string[]) => void
}

type ReturnProps = {
  getAssetDescriptionFromBooth: () => Promise<void>
  onUrlInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  fetching: boolean
  boothUrlInput: string
}

export const useBoothInputTabForEditDialog = ({
  form,
  goToNextTab,
  setImageUrls,
}: Props): ReturnProps => {
  const { preference } = useContext(PreferenceContext)

  const formBoothItemId = form.getValues('boothItemId')
  const formBoothUrl =
    formBoothItemId !== null
      ? convertToBoothURL(formBoothItemId, preference.language)
      : ''

  const [boothUrlInput, setBoothUrlInput] = useState(formBoothUrl)
  const [boothItemId, setBoothItemId] = useState(formBoothItemId)
  const [fetching, setFetching] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

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
        goToNextTab()
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

  return {
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
  }
}
