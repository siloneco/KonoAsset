import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { AssetFormType } from '@/lib/form'
import { ToastAction } from '@/components/ui/toast'
import { buttonVariants } from '@/components/ui/button'
import { AssetType, commands } from '@/lib/bindings'

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
  imagePath: string | null
  setImagePath: (path: string | null) => void
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
      const preAssetResult = createPreAsset({
        assetType: form.getValues('assetType'),
        description: {
          name: form.getValues('name'),
          creator: form.getValues('creator'),
          imagePath: form.getValues('imagePath'),
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
        assetPath!,
        preAssetResult.data,
      )

      if (result.status === 'ok') {
        await refreshAssets()

        const openInFileManager = async () => {
          const openResult = await commands.openManagedDir(result.data.id)

          if (openResult.status === 'error') {
            toast({
              title: 'エラー',
              description: openResult.error,
            })
          }
        }

        toast({
          title: 'アセットが追加されました！',
          description: form.getValues('name'),
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
    imagePath: form.watch('imagePath'),
    setImagePath: (path: string | null) => form.setValue('imagePath', path),
  }
}
