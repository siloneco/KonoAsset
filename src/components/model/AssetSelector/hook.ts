import { useGetElementProperty } from '@/hooks/use-get-element-property'
import { commands, FilterRequest } from '@/lib/bindings'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  onSelected: (assetId: string) => void
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

export const useAssetSelector = ({ onSelected }: Props): ReturnProps => {
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

  const updateFiltered = useCallback(async () => {
    if (searchInput.length <= 0) {
      setFiltered([])
      return
    }

    const req: FilterRequest = {
      assetType: null,
      categories: null,
      queryText: searchInput,
      supportedAvatarMatchType: 'OR',
      supportedAvatars: null,
      tagMatchType: 'OR',
      tags: null,
    }

    const result = await commands.getFilteredAssetIds(req)

    if (result.status === 'ok') {
      setFiltered(result.data)
    }
  }, [searchInput])

  useEffect(() => {
    updateFiltered()
  }, [updateFiltered])

  const onFocus = () => {
    setOpen(true)
  }

  const onBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false)
    }
  }

  const addAndClose = (id: string) => {
    onSelected(id)
    setOpen(false)
  }

  const isMatchedToSearch = (id: string) => {
    if (searchInput.length <= 0) {
      return true
    }

    return filtered.includes(id)
  }

  return {
    open,
    onFocus,
    onBlur,
    searchInput,
    onSearchInputChange: (e) => setSearchInput(e.target.value),
    inputRef,
    popoverMaxHeight,
    isMatchedToSearch,
    addAndClose,
  }
}
