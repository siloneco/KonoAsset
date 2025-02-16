import { useToast } from '@/hooks/use-toast'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { AssetFormType } from '@/lib/form'
import { AssetType } from '@/lib/bindings'
import { PreferenceContext } from '@/components/context/PreferenceContext'

export type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
  setImportTaskId: (taskId: string) => void
}

type ReturnProps = {
  backToAssetTypeSelectorTab: () => void
  submit: () => void
  submitting: boolean
  assetType: AssetType
  imageFilename: string | null
  setImageFilename: (path: string | null) => void
  imageUrlIndex: number
  setImageUrlIndex: (index: number) => void
  deleteSourceChecked: boolean
  setDeleteSourceChecked: (checked: boolean) => void
}

export const useManualInputTabHooks = ({
  form,
  setTab,
  setImportTaskId,
}: Props): ReturnProps => {
  const [submitting, setSubmitting] = useState(false)
  const [imageUrlIndex, setImageUrlIndex] = useState(0)
  const { toast } = useToast()
  const { assetPaths } = useContext(AddAssetModalContext)
  const { preference, setPreference } = useContext(PreferenceContext)

  const backToAssetTypeSelectorTab = () => {
    setTab('asset-type-selector')
  }

  const submit = async () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const preAssetResult = createPreAsset({
        assetType: form.getValues('assetType'),
        description: {
          name: form.getValues('name'),
          creator: form.getValues('creator'),
          imageFilename: form.getValues('imageFilename'),
          tags: form.getValues('tags'),
          boothItemId: form.getValues('boothItemId') ?? null,
          createdAt: new Date().getTime(),
          publishedAt: form.getValues('publishedAt') ?? null,
        },
        category: form.getValues('category'),
        supportedAvatars: form.getValues('supportedAvatars'),
      })

      if (preAssetResult.status === 'error') {
        toast({
          title: 'データのインポートに失敗しました',
          description: preAssetResult.error,
        })

        return
      }

      const result = await sendAssetImportRequest(
        form.getValues('assetType'),
        assetPaths!,
        preAssetResult.data,
        preference.deleteOnImport,
      )

      if (result.status === 'ok') {
        setImportTaskId(result.data)
        setTab('progress')
        return
      }

      console.error(result.error)

      toast({
        title: 'データのインポートを開始できませんでした',
        description: result.error,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return {
    backToAssetTypeSelectorTab,
    submit,
    submitting,
    assetType: form.watch('assetType'),
    imageFilename: form.watch('imageFilename'),
    setImageFilename: (path: string | null) =>
      form.setValue('imageFilename', path),
    imageUrlIndex,
    setImageUrlIndex,
    deleteSourceChecked: preference.deleteOnImport,
    setDeleteSourceChecked: (checked: boolean) =>
      setPreference({ ...preference, deleteOnImport: checked }, true),
  }
}
