import { useEffect, useState } from 'react'
import { getAllAvailableTags } from '../logic'

type ReturnProps = {
  sortedAllTags: string[]
  setSortedAllTags: (_tags: string[]) => void
}

export const useTagPicker = (): ReturnProps => {
  const [sortedAllTags, setSortedAllTags] = useState<string[]>([])

  useEffect(() => {
    getAllAvailableTags().then((tags) => {
      if (tags) {
        setSortedAllTags(tags)
      }
    })
  }, [])

  return {
    sortedAllTags,
    setSortedAllTags,
  }
}
