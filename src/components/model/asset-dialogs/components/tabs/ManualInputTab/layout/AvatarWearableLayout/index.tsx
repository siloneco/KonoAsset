import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

import { Separator } from '@/components/ui/separator'
import TextInputSelect from '@/components/ui/text-input-select'
import { commands } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { useEffect, useState } from 'react'

type Props = {
  form: AssetFormType
}

const AvatarWearableLayout = ({ form }: Props) => {
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
          <Label>対応アバター</Label>
          <MultipleSelector
            options={supportedAvatarCandidates}
            placeholder="対応アバターを選択..."
            className="max-w-72"
            hidePlaceholderWhenSelected
            creatable
            emptyIndicator={
              <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                入力して作成
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
            対応アバターは一覧で絞り込みに利用できます
          </p>
        </div>
        <Separator orientation="vertical" className="h-32 my-auto" />
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
              console.log(value)
              if (value === null) {
                form.setValue('category', '')
              } else {
                form.setValue('category', value.value)
              }
            }}
          />
          <p className="text-foreground/60 text-sm">
            カテゴリは1つまで選択できます (例: 衣装、髪など)
          </p>
        </div>
      </div>
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

export default AvatarWearableLayout
