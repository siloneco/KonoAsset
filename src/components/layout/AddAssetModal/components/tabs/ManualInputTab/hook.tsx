import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { AssetType } from '@/lib/entity'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { UseFormReturn } from 'react-hook-form'

export type Props = {
  setTab: (tab: string) => void
  setDialogOpen: (open: boolean) => void
}

type ReturnProps = {
  form: UseFormReturn<
    {
      title: string
      author: string
      image_src: string
      tags: string[]
      category: string
      booth_url?: string
      published_at?: number
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  backToAssetTypeSelectorTab: () => void
  submit: () => void
  submitting: boolean
  assetType: AssetType
  imageSrc?: string
  setImageSrc: (path: string) => void
}

export const useManualInputTabHooks = ({
  setTab,
  setDialogOpen,
}: Props): ReturnProps => {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { form, assetPath, assetType, supportedAvatars } =
    useContext(AddAssetModalContext)
  const { refreshAssets } = useContext(AssetContext)

  const imageSrc = form?.watch('image_src')

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
        assetType: assetType!,
        description: {
          title: form!.getValues('title'),
          author: form!.getValues('author'),
          image_src: form!.getValues('image_src'),
          tags: form!.getValues('tags'),
          booth_url: form!.getValues('booth_url') ?? null,
          created_at: new Date().getTime(),
          published_at: form!.getValues('published_at') ?? null,
        },
        category: form!.getValues('category'),
        supportedAvatars: supportedAvatars,
      })

      if (preAsset.isFailure()) {
        toast({
          title: 'データのインポートに失敗しました',
          description: preAsset.error.message,
        })

        return
      }

      const result = await sendAssetImportRequest(
        assetType!,
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

  const setImageSrc = (path: string) => {
    form?.setValue('image_src', path)
  }

  return {
    form: form!,
    backToAssetTypeSelectorTab,
    submit,
    submitting,
    assetType: assetType!,
    imageSrc,
    setImageSrc,
  }
}
