import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useEffect } from 'react'
import TextInputSelect from '@/components/ui/text-input-select'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { AssetFormType } from '@/lib/form'
import { commands } from '@/lib/bindings'
import { Label } from '@/components/ui/label'

type Props = {
  form: AssetFormType
}

const WorldObjectLayout = ({ form }: Props) => {
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchExistingCategories = async () => {
    const result = await commands.getWorldObjectCategories()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setCategoryCandidates(result.data.map((value) => ({ label: value, value })))
  }

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setTagCandidates(result.data.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchExistingCategories()
    fetchTagCandidates()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  const rawCategory = form.watch('category')
  const categoryValue = rawCategory
    ? { label: rawCategory, value: rawCategory }
    : null

  return (
    <div className="w-full flex flex-row space-x-2">
      <div className="w-1/2 space-y-2">
        <Label>カテゴリ</Label>
        <TextInputSelect
          options={categoryCandidates}
          placeholder="カテゴリを選択..."
          className="max-w-72"
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              入力して作成
            </p>
          }
          value={categoryValue}
          onChange={(value) => {
            form.setValue('category', value?.value as string)
          }}
        />
        <p className="text-foreground/60 text-sm">
          カテゴリは1つまで選択できます (例: 衣装、髪など)
        </p>
      </div>
      <Separator orientation="vertical" className="h-32 my-auto" />
      <div className="w-1/2 space-y-2">
        <Label>タグ</Label>
        <MultipleSelector
          options={tagCandidates}
          placeholder="タグを選択..."
          className="max-w-72"
          hidePlaceholderWhenSelected
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              入力して作成
            </p>
          }
          onChange={(value) => {
            form.setValue(
              'tags',
              value.map((v) => v.value),
            )
          }}
        />
        <p className="text-foreground/60 text-sm">
          タグは複数選択できます (例: Vket、無料、自作など)
        </p>
      </div>
    </div>
  )
}

export default WorldObjectLayout
