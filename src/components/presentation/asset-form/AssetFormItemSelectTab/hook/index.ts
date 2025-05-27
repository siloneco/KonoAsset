import { useCallback } from 'react'

type Props = {
  openFileOrDirSelector: ({
    type,
  }: {
    type: 'file' | 'directory'
  }) => Promise<string[] | null>
  setItems: (items: string[]) => void
  nextTab: () => void
}

type ReturnProps = {
  onFileButtonClick: () => Promise<void>
  onDirectoryButtonClick: () => Promise<void>
}

export const useAssetFormItemSelectTab = ({
  openFileOrDirSelector,
  setItems,
  nextTab,
}: Props): ReturnProps => {
  const onTriggered = useCallback(
    async (type: 'file' | 'directory') => {
      const items = await openFileOrDirSelector({ type })
      if (items) {
        setItems(items)
        nextTab()
      }
    },
    [openFileOrDirSelector, setItems, nextTab],
  )

  return {
    onFileButtonClick: async () => onTriggered('file'),
    onDirectoryButtonClick: async () => onTriggered('directory'),
  }
}
