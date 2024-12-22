import { Option } from '@/components/ui/multi-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  fetchAvatarRelatedCategoryCandidates,
  fetchSupportedAvatars,
  fetchWorldCategoryCandidates,
  updateAsset,
} from './logic'
import { AssetType, GetAssetResult, SimpleResult } from '@/lib/entity'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from '@tanstack/react-router'
import { AssetFormFields, AssetFormType } from '@/lib/form'

type Props = {
  id: string
  getAssetResult: GetAssetResult
}

type ReturnProps = {
  form: AssetFormType
  submit: () => Promise<void>
  submitting: boolean
  supportedAvatarCandidates: Option[]
  avatarRelatedCategoryCandidates: Option[]
  worldCategoryCandidates: Option[]
}

export const useEditPageHook = ({ id, getAssetResult }: Props): ReturnProps => {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [avatarRelatedCategoryCandidates, setAvatarRelatedCategoryCandidates] =
    useState<Option[]>([])
  const [worldCategoryCandidates, setWorldCategoryCandidates] = useState<
    Option[]
  >([])

  const navigate = useNavigate()

  const formSchema = z.object({
    assetType: z.nativeEnum(AssetType),
    title: z.string().min(1),
    author: z.string().min(1),
    image_src: z.string().nullable(),
    booth_item_id: z.number().nullable(),
    tags: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    published_at: z.number().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: createDefaultValues(getAssetResult),
  })

  const submit = async () => {
    setSubmitting(true)
    try {
      const result: SimpleResult = await updateAsset({ id, form })

      if (!result.success) {
        toast({
          title: 'アップデートに失敗しました.',
          description: result.error_message,
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
    const avatarRelatedResult: string[] =
      await fetchAvatarRelatedCategoryCandidates()
    setAvatarRelatedCategoryCandidates(
      avatarRelatedResult.map((value) => ({ label: value, value })),
    )

    const worldResult: string[] = await fetchWorldCategoryCandidates()
    setWorldCategoryCandidates(
      worldResult.map((value) => ({ label: value, value })),
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
    avatarRelatedCategoryCandidates,
    worldCategoryCandidates,
  }
}

const createDefaultValues = (result: GetAssetResult): AssetFormFields => {
  if (result.avatar_asset !== undefined && result.avatar_asset !== null) {
    const asset = result.avatar_asset

    return {
      assetType: AssetType.Avatar,
      title: asset.description.title,
      author: asset.description.author,
      image_src: asset.description.image_src,
      booth_item_id: asset.description.booth_item_id,
      tags: asset.description.tags,
      category: '',
      supportedAvatars: [],
      published_at: asset.description.published_at,
    }
  } else if (
    result.avatar_related_asset !== undefined &&
    result.avatar_related_asset !== null
  ) {
    const asset = result.avatar_related_asset

    return {
      assetType: AssetType.AvatarRelated,
      title: asset.description.title,
      author: asset.description.author,
      image_src: asset.description.image_src,
      booth_item_id: asset.description.booth_item_id,
      tags: asset.description.tags,
      category: asset.category,
      supportedAvatars: asset.supported_avatars,
      published_at: asset.description.published_at,
    }
  } else if (result.world_asset !== undefined && result.world_asset !== null) {
    const asset = result.world_asset

    return {
      assetType: AssetType.World,
      title: asset.description.title,
      author: asset.description.author,
      image_src: asset.description.image_src,
      booth_item_id: asset.description.booth_item_id,
      tags: asset.description.tags,
      category: asset.category,
      supportedAvatars: [],
      published_at: asset.description.published_at,
    }
  }

  return {
    assetType: AssetType.Avatar,
    title: '',
    author: '',
    image_src: '',
    booth_item_id: null,
    tags: [],
    category: '',
    supportedAvatars: [],
    published_at: null,
  }
}
