import { SortBy } from '@/lib/entity'

type HandleSortByChangeProps = {
  value: string
  setSortBy: (sortBy: SortBy) => void
  setReverseOrder: (reverseOrder: boolean) => void
}

export const handleSortByChange = ({
  value,
  setSortBy,
  setReverseOrder,
}: HandleSortByChangeProps) => {
  switch (value) {
    case 'created_at_desc':
      setSortBy(SortBy.CreatedAt)
      setReverseOrder(true)
      break
    case 'created_at_asc':
      setSortBy(SortBy.CreatedAt)
      setReverseOrder(false)
      break
    case 'title_asc':
      setSortBy(SortBy.Title)
      setReverseOrder(false)
      break
    case 'title_desc':
      setSortBy(SortBy.Title)
      setReverseOrder(true)
      break
    case 'author_asc':
      setSortBy(SortBy.Author)
      setReverseOrder(false)
      break
    case 'author_desc':
      setSortBy(SortBy.Author)
      setReverseOrder(true)
      break
    case 'published_at_desc':
      setSortBy(SortBy.PublishedAt)
      setReverseOrder(true)
      break
    case 'published_at_asc':
      setSortBy(SortBy.PublishedAt)
      setReverseOrder(false)
      break
  }
}

export const convertToSelectID = (sortBy: SortBy, reverseOrder: boolean) => {
  switch (sortBy) {
    case SortBy.CreatedAt:
      return reverseOrder ? 'created_at_desc' : 'created_at_asc'
    case SortBy.Title:
      return reverseOrder ? 'title_desc' : 'title_asc'
    case SortBy.Author:
      return reverseOrder ? 'author_desc' : 'author_asc'
    case SortBy.PublishedAt:
      return reverseOrder ? 'published_at_desc' : 'published_at_asc'
  }
}
