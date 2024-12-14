import { KeyboardEvent, useState } from 'react'

type Props = {
  sortedAllTags: string[]
  setSortedAllTags: (_sortedAllTags: string[]) => void
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_selectedTags: string[]) => void
}

type ReturnProps = {
  newTagValue: string
  setNewTagValue: (_newTagValue: string) => void
  creatingTag: boolean
  handleKeyDownForCreatingTagInput: (
    _event: KeyboardEvent<HTMLInputElement>,
  ) => Promise<void>
}

const useTagListCommandItems = ({
  sortedAllTags,
  setSortedAllTags,
  sortedSelectedTags,
  setSortedSelectedTags,
}: Props): ReturnProps => {
  const [creatingTag, setCreatingTag] = useState(false)
  const [newTagValue, setNewTagValue] = useState('')

  const handleKeyDownForCreatingTagInput = async (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter') {
      return
    }

    if (newTagValue.length <= 0) {
      return
    }

    setCreatingTag(true)

    try {
      if (!sortedAllTags.includes(newTagValue)) {
        const newAllTags = [...sortedAllTags, newTagValue].sort()
        setSortedAllTags(newAllTags)
      }

      if (!sortedSelectedTags.includes(newTagValue)) {
        const newSelectedTags = [...sortedSelectedTags, newTagValue].sort()
        setSortedSelectedTags(newSelectedTags)
      }

      setNewTagValue('')
    } finally {
      setCreatingTag(false)
    }
  }

  return {
    newTagValue,
    setNewTagValue,
    creatingTag,
    handleKeyDownForCreatingTagInput,
  }
}

export default useTagListCommandItems
