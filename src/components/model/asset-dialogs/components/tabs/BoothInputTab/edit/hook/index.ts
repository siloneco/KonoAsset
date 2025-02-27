import { convertToBoothURL, extractBoothItemId } from '@/lib/utils'
import { useState, ChangeEvent, useEffect } from 'react'
import { AssetFormType } from '@/lib/form'
import { useToast } from '@/hooks/use-toast'
import { getAndSetAssetInfoFromBoothToForm } from '../../logic'
import { useLocalization } from '@/hooks/use-localization'

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
  const [boothUrlInput, setBoothUrlInput] = useState('')
  const [boothItemId, setBoothItemId] = useState<number | null>(null)
  const [fetching, setFetching] = useState(false)

  const { t } = useLocalization()
  const { toast } = useToast()

  useEffect(() => {
    const formBoothItemId = form.getValues('boothItemId')

    if (formBoothItemId === null) {
      return
    }

    setBoothUrlInput(convertToBoothURL(formBoothItemId))
    setBoothItemId(formBoothItemId)
  }, [])

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
