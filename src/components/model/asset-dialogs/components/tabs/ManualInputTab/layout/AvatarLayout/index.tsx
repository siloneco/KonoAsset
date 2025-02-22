import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'

import { useEffect, useState } from 'react'

type Props = {
  form: AssetFormType
}

const AvatarLayout = ({ form }: Props) => {
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setTagCandidates(result.data.map((value) => ({ label: value, value })))
  }

  useEffect(() => {
    fetchTagCandidates()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-row space-x-2 mb-4">
      <div className="w-full space-y-2">
        <Label>タグ</Label>
        <MultipleSelector
          options={tagCandidates}
          placeholder="タグを選択..."
          className="max-w-[600px]"
          hidePlaceholderWhenSelected
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
              入力して作成
            </p>
          }
          value={form.getValues('tags').map((tag) => {
            return {
              label: tag,
              value: tag,
            }
          })}
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

export default AvatarLayout
