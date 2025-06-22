import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'
import TextInputSelect, {
  Option as TextInputSelectOption,
} from '@/components/ui/text-input-select'
import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { useEffect, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import MultipleSelector, {
  Option as MultiSelectOption,
} from '@/components/ui/multi-select'

type Props = {
  form: AssetFormType
}

export const AvatarWearableLayout = ({ form }: Props) => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<
    TextInputSelectOption[]
  >([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    MultiSelectOption[]
  >([])
  const [tagCandidates, setTagCandidates] = useState<MultiSelectOption[]>([])

  const fetchSupportedAvatars = async () => {
    const result = await commands.getAvatarWearableSupportedAvatars(null)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const options: MultiSelectOption[] = result.data.map((entry) => {
      const value = entry.value
      return { label: value, value, priority: entry.priority }
    })

    setSupportedAvatarCandidates(options)
  }

  const fetchExistingCategories = async () => {
    const result = await commands.getAvatarWearableCategories(null)

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    setCategoryCandidates(
      result.data.map((entry) => ({
        value: entry.value,
        priority: entry.priority,
      })),
    )
  }

  const fetchTagCandidates = async () => {
    const result = await commands.getAllAssetTags(null)

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
    fetchSupportedAvatars()
    fetchExistingCategories()
    fetchTagCandidates()
  }, [])

  if (!form) {
    return <div>Loading...</div>
  }

  return (
    <div className="mb-4">
      <div className="w-full flex flex-row space-x-2 space-y-4">
        <div className="w-1/2 space-y-2">
          <Label> {t('general:supported-avatars')} </Label>
          <MultipleSelector
            options={supportedAvatarCandidates}
            placeholder={t('addasset:supported-avatars:placeholder')}
            className="max-w-72"
            badgeClassName="max-w-58"
            hidePlaceholderWhenSelected
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-muted-foreground">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={form.getValues('supportedAvatars')}
            onChange={(value) => {
              form.setValue('supportedAvatars', value)
            }}
          />
          <p className="text-muted-foreground text-sm">
            {t('addasset:supported-avatars:explanation-text')}
          </p>
        </div>
        <Separator orientation="vertical" className="h-32 my-auto" />
        <div className="w-1/2 space-y-2">
          <Label> {t('general:category')} </Label>
          <TextInputSelect
            options={categoryCandidates}
            placeholder={t('addasset:category:placeholder')}
            className="max-w-72"
            emptyIndicator={
              <p className="text-center text-lg text-muted-foreground">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={form.watch('category')}
            onChange={(value) => {
              form.setValue('category', value)
            }}
          />
          <p className="text-muted-foreground text-sm">
            {t('addasset:category:explanation-text')}
          </p>
        </div>
      </div>
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
          value={form.getValues('tags')}
          onChange={(value) => {
            form.setValue('tags', value)
          }}
        />
        <p className="text-muted-foreground text-sm">
          {t('addasset:tag:explanation-text')}
        </p>
      </div>
    </div>
  )
}
