import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { Result } from '@/lib/bindings'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  onSelected: (assetId: string) => void
  filterAssetByText: (text: string) => Promise<Result<string[], string>>
}

type ReturnProps = {
  open: boolean
  onFocus: () => void
  onBlur: (e: React.FocusEvent<HTMLDivElement, Element>) => void
  searchInput: string
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputRef: RefObject<HTMLInputElement | null>
  popoverMaxHeight: number
  isMatchedToSearch: (id: string) => boolean
  addAndClose: (id: string) => void
}

export const useAssetSelectorInput = ({
  onSelected,
  filterAssetByText,
}: Props): ReturnProps => {
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [filtered, setFiltered] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement>(null)
  const [popoverMaxHeight, setPopoverMaxHeight] = useState<number>(300)

  const { getElementProperty } = useGetElementProperty(inputRef)

  // suggestの高さを適切に設定する
  const updateMaxHeight = useCallback(() => {
    const windowHeight = window.innerHeight
    const inputDivBottom = getElementProperty('bottom')
    const maxHeight = Math.min(
      Math.max(windowHeight - inputDivBottom - 20, 75),
      500,
    )

    setPopoverMaxHeight(maxHeight)
  }, [getElementProperty])

  useEffect(() => {
    updateMaxHeight()

    window.addEventListener('resize', updateMaxHeight)
    return () => window.removeEventListener('resize', updateMaxHeight)
  }, [updateMaxHeight])

  const updateFiltered = useCallback(
    async (input: string) => {
      if (input.length <= 0) {
        setFiltered([])
        return
      }

      const result = await filterAssetByText(input)

      if (result.status === 'ok') {
        setFiltered(result.data)
      }
    },
    [filterAssetByText],
  )

  const onFocus = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement, Element>) => {
      console.log(e.currentTarget)
      console.log(e.relatedTarget)
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setOpen(false)
      }
    },
    [setOpen],
  )

  const addAndClose = useCallback(
    (id: string) => {
      onSelected(id)
      setOpen(false)
    },
    [onSelected],
  )

  const isMatchedToSearch = useCallback(
    (id: string) => {
      if (searchInput.length <= 0) {
        return true
      }

      return filtered.includes(id)
    },
    [filtered, searchInput],
  )

  const onSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value

      setSearchInput(input)
      updateFiltered(input)
    },
    [updateFiltered],
  )

  return {
    open,
    onFocus,
    onBlur,
    searchInput,
    onSearchInputChange,
    inputRef,
    popoverMaxHeight,
    isMatchedToSearch,
    addAndClose,
  }
}
