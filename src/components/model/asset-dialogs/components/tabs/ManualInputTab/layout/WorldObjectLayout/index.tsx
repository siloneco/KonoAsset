import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import TextInputSelect from '@/components/ui/text-input-select'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { AssetFormType } from '@/lib/form'
import { commands } from '@/lib/bindings'
import { Label } from '@/components/ui/label'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  form: AssetFormType
}

export const WorldObjectLayout = ({ form }: Props) => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchExistingCategories = async () => {
    const result = await commands.getWorldObjectCategories(null)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setCategoryCandidates(
      result.data.map((entry) => ({
        label: entry.value,
        value: entry.value,
        priority: entry.priority,
      })),
    )
  }

  const fetchTagCandidates = async () => {
    const result = await commands.getAssetTags('WorldObject', null)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setTagCandidates(
      result.data.map((entry) => ({
        label: entry.value,
        value: entry.value,
        priority: entry.priority,
      })),
    )
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
    <div className="w-full flex flex-row space-x-2 mb-4">
      <div className="w-1/2 space-y-2">
        <Label> {t('general:category')} </Label>
        <TextInputSelect
          options={categoryCandidates}
          placeholder={t('addasset:category:placeholder')}
          className="max-w-72"
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-muted-foreground">
              {t('addasset:empty-indicator')}
            </p>
          }
          value={categoryValue}
          onChange={(value) => {
            form.setValue('category', value?.value as string)
          }}
        />
        <p className="text-muted-foreground text-sm">
          {t('addasset:category:explanation-text')}
        </p>
      </div>
      <Separator orientation="vertical" className="h-32 my-auto" />
      <div className="w-1/2 space-y-2">
        <Label> {t('general:tag')} </Label>
        <MultipleSelector
          options={tagCandidates}
          placeholder={t('addasset:tag:placeholder')}
          className="max-w-72"
          badgeClassName="max-w-58"
          hidePlaceholderWhenSelected
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-muted-foreground">
              {t('addasset:empty-indicator')}
            </p>
          }
          onChange={(value) => {
            form.setValue(
              'tags',
              value.map((v) => v.value),
            )
          }}
        />
        <p className="text-muted-foreground text-sm">
          {t('addasset:tag:explanation-text')}
        </p>
      </div>
    </div>
  )
}
