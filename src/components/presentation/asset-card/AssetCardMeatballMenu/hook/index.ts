import { LanguageCode } from '@/lib/bindings'
import { convertToBoothURL } from '@/lib/booth'
import { useMemo, useState } from 'react'

type Props = {
  boothItemId: number | null
  language: LanguageCode
}

type ReturnProps = {
  boothUrl: string | null
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
}

export const useAssetCardMeatballMenu = ({
  boothItemId,
  language,
}: Props): ReturnProps => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const boothUrl = useMemo(() => {
    if (boothItemId === null) {
      return null
    }

    return convertToBoothURL(boothItemId, language)
  }, [boothItemId, language])

  return {
    boothUrl,
    deleteDialogOpen,
    setDeleteDialogOpen,
  }
}
