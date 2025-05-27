import { useCallback, useState } from 'react'

type Props = {
  onOpenButtonClick: () => Promise<boolean>
}

type ReturnProps = {
  openButtonLoading: boolean
  openButtonChecked: boolean
  onMainOpenButtonClick: () => Promise<void>
}

export const useAssetCardOpenButton = ({
  onOpenButtonClick,
}: Props): ReturnProps => {
  const [openButtonLoading, setOpenButtonLoading] = useState(false)
  const [openButtonChecked, setOpenButtonChecked] = useState(false)

  const onMainOpenButtonClick = useCallback(async () => {
    if (openButtonLoading) {
      return
    }

    setOpenButtonLoading(true)
    setOpenButtonChecked(false)

    try {
      const result = await onOpenButtonClick()

      if (result) {
        setOpenButtonChecked(true)
        setTimeout(() => {
          setOpenButtonChecked(false)
        }, 1000)
      }
    } finally {
      setOpenButtonLoading(false)
    }
  }, [onOpenButtonClick, openButtonLoading])

  return {
    openButtonLoading,
    openButtonChecked,
    onMainOpenButtonClick,
  }
}
