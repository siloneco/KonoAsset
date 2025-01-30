import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useState } from 'react'

type Props = {
  value?: string
  onValueChange: (value: string) => void
  submitting: boolean

  categoryCandidates: string[]
  addNewCategory: (value: string) => void
}

const CategorySelector = ({
  value,
  onValueChange,
  submitting,
  categoryCandidates,
  addNewCategory,
}: Props) => {
  const [newValue, setNewValue] = useState('')

  const handleKeyDownForCreatingCategory = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter') {
      return
    }

    if (newValue.length <= 0) {
      return
    }

    addNewCategory(newValue)
    setNewValue('')
  }

  return (
    <Select onValueChange={onValueChange} disabled={submitting} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="カテゴリを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categoryCandidates.map(
            (category) =>
              category.length > 0 && (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ),
          )}
          <Separator className="my-1" />
          <div className="h-8 flex flex-row items-center space-x-2">
            <Plus size={16} className="w-6" />
            <input
              placeholder="新しく作成"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyDownForCreatingCategory}
              className="bg-transparent outline-none w-32"
            />
          </div>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CategorySelector
