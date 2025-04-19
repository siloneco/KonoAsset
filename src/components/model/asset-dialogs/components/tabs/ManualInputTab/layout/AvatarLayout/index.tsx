import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { useLocalization } from '@/hooks/use-localization'

import { useEffect, useState } from 'react'

type Props = {
  form: AssetFormType
}

const AvatarLayout = ({ form }: Props) => {
  const { t } = useLocalization()
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags()

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
    fetchTagCandidates()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-row space-x-2 mb-4">
      <div className="w-full space-y-2">
        <Label> {t('general:tag')} </Label>
        <MultipleSelector
          options={tagCandidates}
          placeholder={t('addasset:tag:placeholder')}
          className="max-w-[600px]"
          hidePlaceholderWhenSelected
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-muted-foreground">
              {t('addasset:empty-indicator')}
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
        <p className="text-muted-foreground text-sm">
          {t('addasset:tag:explanation-text')}
        </p>
      </div>
    </div>
  )
}

export default AvatarLayout
