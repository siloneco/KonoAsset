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
    setRefreshButtonChecked(false)
    await refreshEntries()
    setRefreshButtonChecked(true)

    setTimeout(() => {
      setRefreshButtonChecked(false)
    }, 1000)
  }, [refreshEntries])

  return {
    refreshButtonChecked,
    onRefreshButtonClicked,
  }
}
