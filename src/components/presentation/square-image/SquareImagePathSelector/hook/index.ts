import { useCallback } from 'react'

type Props = {
  openPathSelectDialog: () => Promise<string | null>
  onSelect: (path: string) => void
}

type ReturnProps = {
  onClick: () => Promise<void>
}

export const useSquareImagePathSelector = ({
  openPathSelectDialog,
  onSelect,
}: Props): ReturnProps => {
  const onClick = useCallback(async () => {
    const path = await openPathSelectDialog()

    if (path === null) {
      return
    }

    onSelect(path)
  }, [openPathSelectDialog, onSelect])

  return {
    onClick,
  }
}
