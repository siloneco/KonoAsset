import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { AssetFormType } from '@/lib/form'
import { AssetType } from '@/lib/entity'

export type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

type ReturnProps = {
  backToAssetTypeSelectorTab: () => void
  submit: () => void
  submitting: boolean
  assetType: AssetType
  imageSrc: string | null
  setImageSrc: (path: string | null) => void
}

export const useManualInputTabHooks = ({
  form,
  setTab,
  setDialogOpen,
}: Props): ReturnProps => {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { assetPath } = useContext(AddAssetModalContext)
  const { refreshAssets } = useContext(AssetContext)

  const backToAssetTypeSelectorTab = () => {
    setTab('asset-type-selector')
  }

  const submit = async () => {
    if (submitting) {
      return
    }

    setSubmitting(true)

    try {
      const preAsset = createPreAsset({
        assetType: form.getValues('assetType'),
        description: {
          title: form.getValues('title'),
          author: form.getValues('author'),
          image_src: form.getValues('image_src'),
          tags: form.getValues('tags'),
          booth_url: form.getValues('booth_url') ?? null,
          created_at: new Date().getTime(),
          published_at: form.getValues('published_at') ?? null,
        },
        category: form.getValues('category'),
        supportedAvatars: form.getValues('supportedAvatars'),
      })

      if (preAsset.isFailure()) {
        toast({
          title: 'データのインポートに失敗しました',
          description: preAsset.error.message,
        })

        return
      }

      const result = await sendAssetImportRequest(
        form.getValues('assetType'),
        assetPath!,
        preAsset.value,
      )

      if (result.isSuccess()) {
        await refreshAssets()

        toast({
          title: 'データのインポートが完了しました！',
        })

        setDialogOpen(false)
        return
      }

      toast({
        title: 'データのインポートに失敗しました',
        description: result.error.message,
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
    imageSrc: form.watch('image_src'),
    setImageSrc: (path: string | null) => form.setValue('image_src', path),
  }
}
