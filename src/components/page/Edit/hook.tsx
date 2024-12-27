import { Option } from '@/components/ui/multi-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  fetchAvatarWearableCategoryCandidates,
  fetchSupportedAvatars,
  fetchWorldObjectCategoryCandidates,
  updateAsset,
} from './logic'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from '@tanstack/react-router'
import { AssetFormFields, AssetFormType } from '@/lib/form'
import { AssetType, GetAssetResult } from '@/lib/bindings'

type Props = {
  id: string
  getAssetResult: GetAssetResult
}

type ReturnProps = {
  form: AssetFormType
  submit: () => Promise<void>
  submitting: boolean
  supportedAvatarCandidates: Option[]
  avatarWearableCategoryCandidates: Option[]
  worldObjectCategoryCandidates: Option[]
}

export const useEditPageHook = ({ id, getAssetResult }: Props): ReturnProps => {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [
    avatarWearableCategoryCandidates,
    setAvatarWearableCategoryCandidates,
  ] = useState<Option[]>([])
  const [worldObjectCategoryCandidates, setWorldObjectCategoryCandidates] =
    useState<Option[]>([])

  const navigate = useNavigate()

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
    imagePath: z.string().nullable(),
    boothItemId: z.number().nullable(),
    tags: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    publishedAt: z.number().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(getAssetResult),
  })

  const submit = async () => {
    setSubmitting(true)
    try {
      const result = await updateAsset({ id, form })

      if (result.status === 'error') {
        toast({
          title: 'アップデートに失敗しました.',
          description: result.error,
        })
        return
      }

      navigate({ to: '/' })
    } finally {
      setSubmitting(false)
    }
  }

  const updateSupportedAvatars = async () => {
    const options: Option[] = await fetchSupportedAvatars()
    setSupportedAvatarCandidates(options)
  }

  const updateCategoryCandidates = async () => {
    const avatarWearableCategoryResult: string[] =
      await fetchAvatarWearableCategoryCandidates()
    setAvatarWearableCategoryCandidates(
      avatarWearableCategoryResult.map((value) => ({ label: value, value })),
    )

    const worldObjectCategoryResult: string[] =
      await fetchWorldObjectCategoryCandidates()
    setWorldObjectCategoryCandidates(
      worldObjectCategoryResult.map((value) => ({ label: value, value })),
    )
  }

  useEffect(() => {
    updateSupportedAvatars()
    updateCategoryCandidates()
  }, [])

  return {
    form,
    submit,
    submitting,
    supportedAvatarCandidates,
    avatarWearableCategoryCandidates,
    worldObjectCategoryCandidates,
  }
}

const createDefaultValues = (result: GetAssetResult): AssetFormFields => {
  if (result.assetType === 'Avatar' && result.avatar !== null) {
    const asset = result.avatar

    return {
      assetType: 'Avatar',
      name: asset.description.name,
      creator: asset.description.creator,
      imagePath: asset.description.imagePath,
      boothItemId: asset.description.boothItemId,
      tags: asset.description.tags,
      category: '',
      supportedAvatars: [],
      publishedAt: asset.description.publishedAt,
    }
  } else if (
    result.assetType === 'AvatarWearable' &&
    result.avatarWearable !== null
  ) {
    const asset = result.avatarWearable

    return {
      assetType: 'AvatarWearable',
      name: asset.description.name,
      creator: asset.description.creator,
      imagePath: asset.description.imagePath,
      boothItemId: asset.description.boothItemId,
      tags: asset.description.tags,
      category: asset.category,
      supportedAvatars: asset.supportedAvatars,
      publishedAt: asset.description.publishedAt,
    }
  } else if (
    result.assetType === 'WorldObject' &&
    result.worldObject !== null
  ) {
    const asset = result.worldObject

    return {
      assetType: 'WorldObject',
      name: asset.description.name,
      creator: asset.description.creator,
      imagePath: asset.description.imagePath,
      boothItemId: asset.description.boothItemId,
      tags: asset.description.tags,
      category: asset.category,
      supportedAvatars: [],
      publishedAt: asset.description.publishedAt,
    }
  }

  return {
    assetType: 'Avatar',
    name: '',
    creator: '',
    imagePath: null,
    boothItemId: null,
    tags: [],
    category: '',
    supportedAvatars: [],
    publishedAt: null,
  }
}
