import { SortBy } from '@/lib/bindings'

type HandleSortByChangeProps = {
  value: string
  setSort: (sortBy: SortBy, reverseOrder: boolean) => void
}

export const handleSortByChange = ({
  value,
  setSort,
}: HandleSortByChangeProps) => {
  switch (value) {
    case 'CreatedAtDesc':
      setSort('CreatedAt', true)
      break
    case 'CreatedAtAsc':
      setSort('CreatedAt', false)
      break
    case 'NameAsc':
      setSort('Name', false)
      break
    case 'NameDesc':
      setSort('Name', true)
      break
    case 'CreatorAsc':
      setSort('Creator', false)
      break
    case 'CreatorDesc':
      setSort('Creator', true)
      break
    case 'PublishedAtDesc':
      setSort('PublishedAt', true)
      break
    case 'PublishedAtAsc':
      setSort('PublishedAt', false)
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
