import { BoothAssetInfo, Result } from '@/lib/bindings'
import { extractBoothItemId, isBoothURL } from '@/lib/booth'

import { useCallback, useMemo, useState } from 'react'

type Props = {
  filenames?: string[]
  fetchBoothInformation: (
    boothItemId: number,
  ) => Promise<Result<BoothAssetInfo, string>>
  checkDuplicateAsset?: (
    boothItemId: number,
  ) => Promise<'ok' | 'movedToDuplicateTab'>
  setBoothInformation: (boothInformation: BoothAssetInfo) => void
  nextTab: () => void
}

type ReturnProps = {
  urlInput: string
  setUrlInput: (value: string) => void
  representativeItemFilename: string
  itemCount: number
  fetching: boolean
  fetchButtonDisabled: boolean
  onFetchButtonClick: () => Promise<void>
}

export const useAssetFormBoothInputTab = ({
  filenames,
  fetchBoothInformation,
  checkDuplicateAsset,
  setBoothInformation,
  nextTab,
}: Props): ReturnProps => {
  const [urlInput, setUrlInput] = useState<string>('')
  const [fetching, setFetching] = useState<boolean>(false)

  const extractedBoothItemId = useMemo(() => {
    if (!isBoothURL(urlInput)) {
      return null
    }

    const result = extractBoothItemId(urlInput)

    if (result.status === 'ok') {
      return result.data
    }

    return null
  }, [urlInput])

  const onFetchButtonClick = useCallback(async () => {
    if (extractedBoothItemId === null) {
      return
    }

    setFetching(true)
    try {
      const result = await fetchBoothInformation(extractedBoothItemId)

      if (result.status === 'ok') {
        setBoothInformation(result.data)

        if (checkDuplicateAsset !== undefined) {
          const checkResult = await checkDuplicateAsset(extractedBoothItemId)

          if (checkResult === 'movedToDuplicateTab') {
            return
          }
        }

        nextTab()
      }
    } finally {
      setFetching(false)
    }
  }, [
    fetchBoothInformation,
    checkDuplicateAsset,
    setBoothInformation,
    nextTab,
    extractedBoothItemId,
  ])

  const representativeItemFilename = useMemo(() => {
    if (filenames === undefined || filenames.length === 0) {
      return ''
    }

    return filenames[0]
  }, [filenames])

  const itemCount = useMemo(() => {
    if (filenames === undefined) {
      return 0
    }

    return filenames.length
  }, [filenames])

  return {
    urlInput,
    setUrlInput,
    representativeItemFilename,
    itemCount,
    fetching,
    fetchButtonDisabled: fetching || extractedBoothItemId === null,
    onFetchButtonClick,
  }
}
