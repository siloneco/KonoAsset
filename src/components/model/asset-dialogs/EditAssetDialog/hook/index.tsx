import { AssetDescription, AssetType } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { fetchAssetInformation, updateAsset } from '../logic'
import { useToast } from '@/hooks/use-toast'
import { useLocalization } from '@/hooks/use-localization'
import { useAssetSummaryStore } from '@/stores/AssetSummaryStore'
import { PersistentContext } from '@/components/context/PersistentContext'

const setDescriptionToForm = (
  form: AssetFormType,
  description: AssetDescription,
) => {
  form.setValue('name', description.name)
  form.setValue('creator', description.creator)
  form.setValue('imageFilename', description.imageFilename)
  form.setValue('boothItemId', description.boothItemId)
  form.setValue('tags', description.tags)
  form.setValue('memo', description.memo)
  form.setValue('dependencies', description.dependencies)
  form.setValue('publishedAt', description.publishedAt)
}

type Props = {
  id: string | null
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

type ReturnProps = {
  loadingAssetData: boolean
  form: AssetFormType
  tab: string
  setTab: (tab: string) => void
  imageUrls: string[]
  setImageUrls: (urls: string[]) => void
  onSubmit: () => Promise<void>
  submitting: boolean
}

export const useEditAssetDialog = ({
  id,
  dialogOpen,
  setDialogOpen,
}: Props): ReturnProps => {
  const [tab, setTab] = useState('booth-input')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loadingAssetData, setLoadingAssetData] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { refreshAssetSummaries } = useAssetSummaryStore()
  const { sortBy } = useContext(PersistentContext)

  const { t } = useLocalization()
  const { toast } = useToast()

  const assetTypeAvatar: AssetType = 'Avatar'
  const assetTypeAvatarWearable: AssetType = 'AvatarWearable'
  const assetTypeWorldObject: AssetType = 'WorldObject'

  const formSchema = z.object({
    assetType: z.union([
      z.literal(assetTypeAvatar),
      z.literal(assetTypeAvatarWearable),
      z.literal(assetTypeWorldObject),
    ]),
    name: z.string().min(1),
    creator: z.string().min(1),
    imageFilename: z.string().nullable(),
    boothItemId: z.number().nullable(),
    tags: z.array(z.string()),
    memo: z.string().nullable(),
    dependencies: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    publishedAt: z.number().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: 'Avatar',
      name: '',
      creator: '',
      imageFilename: null,
      boothItemId: null,
      tags: [],
      memo: null,
      dependencies: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    },
  })

  const clearForm = useCallback(() => {
    form.reset({
      assetType: 'Avatar',
      name: '',
      creator: '',
      imageFilename: null,
      boothItemId: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    })

    setImageUrls([])
  }, [form, setImageUrls])

  useEffect(() => {
    if (!dialogOpen) {
      // 閉じるときにタブが変わってしまうのが見えるため遅延を入れる
      setTimeout(() => {
        clearForm()
        setTab('booth-input')
        setLoadingAssetData(true)
      }, 500)
    }
  }, [dialogOpen, clearForm])

  const loadAssetData = useCallback(
    async (id: string) => {
      setLoadingAssetData(true)
      const result = await fetchAssetInformation(id)

      if (result.status === 'error') {
        toast({
          title: t('addasset:get:error-toast'),
          description: result.error,
        })
        return
      }

      const data = result.data

      if (data.assetType === 'Avatar') {
        const avatar = data.avatar!

        form.setValue('assetType', 'Avatar')
        setDescriptionToForm(form, avatar.description)
      } else if (data.assetType === 'AvatarWearable') {
        const avatarWearable = data.avatarWearable!

        form.setValue('assetType', 'AvatarWearable')
        form.setValue('category', avatarWearable.category)
        form.setValue('supportedAvatars', avatarWearable.supportedAvatars)
        setDescriptionToForm(form, avatarWearable.description)
      } else if (data.assetType === 'WorldObject') {
        const worldObject = data.worldObject!

        form.setValue('assetType', 'WorldObject')
        form.setValue('category', worldObject.category)
        setDescriptionToForm(form, worldObject.description)
      } else {
        toast({
          title: t('addasset:get:error-toast'),
          description: t('addasset:get:error-toast:unknown-asset-type'),
        })

        setDialogOpen(false)
        return
      }

      setLoadingAssetData(false)
    },
    [form, setDialogOpen, t, toast],
  )

  useEffect(() => {
    if (dialogOpen && loadingAssetData && id !== null) {
      loadAssetData(id)
    }
  }, [dialogOpen, id, loadingAssetData, loadAssetData])

  const onSubmit = async () => {
    if (submitting || id === null) {
      return
    }

    setSubmitting(true)

    try {
      const result = await updateAsset({ id, form })

      if (result.status === 'ok') {
        if (result.data === true) {
          await refreshAssetSummaries(sortBy)

          setDialogOpen(false)
          toast({
            title: t('addasset:get:success-toast'),
          })
        } else {
          toast({
            title: t('addasset:get:error-toast'),
          })
        }
        return
      }

      toast({
        title: t('addasset:get:error-toast'),
        description: result.error,
      })

      console.error(result.error)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    loadingAssetData,
    form,
    tab,
    setTab,
    imageUrls,
    setImageUrls,
    onSubmit,
    submitting,
  }
}
