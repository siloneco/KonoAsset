import { useCallback, useState } from 'react'

type Props = {
  refreshEntries: () => Promise<void>
}

type ReturnProps = {
  refreshButtonChecked: boolean
  onRefreshButtonClicked: () => Promise<void>
}

export const useInternalDataManagementDialog = ({
  refreshEntries,
}: Props): ReturnProps => {
  const [refreshButtonChecked, setRefreshButtonChecked] = useState(false)
  const onRefreshButtonClicked = useCallback(async () => {
    setRefreshButtonChecked(true)

    try {
      await refreshEntries()
    } finally {
      setRefreshButtonChecked(false)
    }
  }, [refreshEntries])

  return {
    refreshButtonChecked,
    onRefreshButtonClicked,
  }
}
