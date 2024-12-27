import { SortBy } from '@/lib/bindings'

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
    case 'CreatedAtDesc':
      setSortBy('CreatedAt')
      setReverseOrder(true)
      break
    case 'CreatedAtAsc':
      setSortBy('CreatedAt')
      setReverseOrder(false)
      break
    case 'NameAsc':
      setSortBy('Name')
      setReverseOrder(false)
      break
    case 'NameDesc':
      setSortBy('Name')
      setReverseOrder(true)
      break
    case 'CreatorAsc':
      setSortBy('Creator')
      setReverseOrder(false)
      break
    case 'CreatorDesc':
      setSortBy('Creator')
      setReverseOrder(true)
      break
    case 'PublishedAtDesc':
      setSortBy('PublishedAt')
      setReverseOrder(true)
      break
    case 'PublishedAtAsc':
      setSortBy('PublishedAt')
      setReverseOrder(false)
      break
  }
}

export const convertToSelectID = (sortBy: SortBy, reverseOrder: boolean) => {
  switch (sortBy) {
    case 'CreatedAt':
      return reverseOrder ? 'CreatedAtDesc' : 'CreatedAtAsc'
    case 'Name':
      return reverseOrder ? 'NameDesc' : 'NameAsc'
    case 'Creator':
      return reverseOrder ? 'CreatorDesc' : 'CreatorAsc'
    case 'PublishedAt':
      return reverseOrder ? 'PublishedAtDesc' : 'PublishedAtAsc'
  }
}
