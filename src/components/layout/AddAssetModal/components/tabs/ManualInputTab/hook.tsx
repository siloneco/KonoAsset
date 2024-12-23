import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { AssetFormType } from '@/lib/form'
import { AssetType, DirectoryOpenResult } from '@/lib/entity'
import { ToastAction } from '@/components/ui/toast'
import { buttonVariants } from '@/components/ui/button'
import { invoke } from '@tauri-apps/api/core'

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
          booth_item_id: form.getValues('booth_item_id') ?? null,
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

        const openInFileManager = async () => {
          const openResult: DirectoryOpenResult = await invoke(
            'open_in_file_manager',
            {
              id: result.value.id,
            },
          )

          if (!openResult.success) {
            toast({
              title: 'エラー',
              description: openResult.error_message,
            })
          }
        }

        toast({
          title: 'アセットが追加されました！',
          description: form.getValues('title'),
          action: (
            <ToastAction
              altText="open"
              className={buttonVariants({ variant: 'default' })}
              onClick={openInFileManager}
            >
              開く
            </ToastAction>
          ),
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
