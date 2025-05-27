import { useCallback, useState } from 'react'

type Props = {
  cancel: () => Promise<void>
}

type ReturnProps = {
  onCancelButtonClick: () => Promise<void>
  canceling: boolean
}

export const useTaskProgressDialogContent = ({
  cancel,
}: Props): ReturnProps => {
  const [canceling, setCanceling] = useState(false)

  const onCancelButtonClick = useCallback(async () => {
    setCanceling(true)
    await cancel()
    setCanceling(false)
  }, [cancel])

  return {
    onCancelButtonClick,
    canceling,
  }
}
