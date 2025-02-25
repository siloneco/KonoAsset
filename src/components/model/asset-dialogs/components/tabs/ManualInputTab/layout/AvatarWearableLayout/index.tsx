import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { Separator } from '@/components/ui/separator'
import TextInputSelect from '@/components/ui/text-input-select'
import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { useEffect, useState } from 'react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  form: AssetFormType
}

const AvatarWearableLayout = ({ form }: Props) => {
  const { t } = useLocalization()
  const [categoryCandidates, setCategoryCandidates] = useState<Option[]>([])
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [tagCandidates, setTagCandidates] = useState<Option[]>([])

  const fetchSupportedAvatars = async () => {
    const result = await commands.getAllSupportedAvatarValues()

    if (result.status === 'error') {
      console.error(result.error)
      return
    }

    const options = result.data.map((value) => {
      return { label: value, value }
    })

    setSupportedAvatarCandidates(options)
  }

  const fetchExistingCategories = async () => {
    const result = await commands.getAvatarWearableCategories()

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
    fetchSupportedAvatars()
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
    <div className="mb-4">
      <div className="w-full flex flex-row space-x-2">
        <div className="w-1/2 space-y-2">
          <Label> {t('general:supported-avatars')} </Label>
          <MultipleSelector
            options={supportedAvatarCandidates}
            placeholder={t('addasset:supported-avatars:placeholder')}
            className="max-w-72"
            hidePlaceholderWhenSelected
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={form.getValues('supportedAvatars').map((supportedAvatar) => {
              return {
                label: supportedAvatar,
                value: supportedAvatar,
              }
            })}
            onChange={(value) => {
              form.setValue(
                'supportedAvatars',
                value.map((v) => v.value),
              )
            }}
          />
          <p className="text-foreground/60 text-sm">
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
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                {t('addasset:empty-indicator')}
              </p>
            }
            value={categoryValue}
            onChange={(value) => {
              if (value === null) {
                form.setValue('category', '')
              } else {
                form.setValue('category', value.value)
              }
            }}
          />
          <p className="text-foreground/60 text-sm">
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
          hidePlaceholderWhenSelected
          creatable
          emptyIndicator={
            <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
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
        <p className="text-foreground/60 text-sm">
          {t('addasset:tag:explanation-text')}
        </p>
      </div>
    </div>
  )
}

export default AvatarWearableLayout
