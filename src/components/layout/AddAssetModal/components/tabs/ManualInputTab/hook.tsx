import { AssetContext } from '@/components/context/AssetContext'
import { useToast } from '@/hooks/use-toast'
import {
  AssetType,
  AvatarAsset,
  AvatarRelatedAsset,
  WorldAsset,
} from '@/lib/entity'
import { useState, useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { createPreAsset, sendAssetImportRequest } from './logic'
import { UseFormReturn } from 'react-hook-form'
import { open } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

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
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  backToAssetTypeSelectorTab: () => void
  openImageSelector: () => void
  submit: () => void
  submitting: boolean
  assetType: AssetType
  imageSrc?: string
}

export const useManualInputTabHooks = ({
  setTab,
  setDialogOpen,
}: Props): ReturnProps => {
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { form, assetPath, assetType, supportedAvatars } =
    useContext(AddAssetModalContext)
  const { addAvatarAsset, addAvatarRelatedAsset, addWorldAsset } =
    useContext(AssetContext)

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
          created_at: new Date().toISOString(),
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
        console.log(result.value)
        if (assetType === AssetType.Avatar) {
          addAvatarAsset(result.value as AvatarAsset)
        } else if (assetType === AssetType.AvatarRelated) {
          addAvatarRelatedAsset(result.value as AvatarRelatedAsset)
        } else if (assetType === AssetType.World) {
          addWorldAsset(result.value as WorldAsset)
        }

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

  const openImageSelector = async () => {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
    })

    if (path === null) {
      return
    }

    const result: string = await invoke('copy_image_file_to_images', { path })
    form?.setValue('image_src', result)
  }

  return {
    form: form!,
    backToAssetTypeSelectorTab,
    openImageSelector,
    submit,
    submitting,
    assetType: assetType!,
    imageSrc,
  }
}
