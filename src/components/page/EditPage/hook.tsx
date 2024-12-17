import { Option } from '@/components/ui/multi-select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import {
  fetchAssetInformation,
  fetchCategoryCandidates,
  fetchSupportedAvatars,
} from './logic'
import { AssetType } from '@/lib/entity'

type Props = {
  id: string
}

type ReturnProps = {
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      tags: string[]
      category: string
      supportedAvatars: string[]
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  submit: () => Promise<void>
  submitting: boolean
  supportedAvatarCandidates: Option[]
  categoryCandidates: string[]
  addNewCategoryCandidates: (value: string) => void
  initializing: boolean
}

export const useEditPageHook = ({ id }: Props): ReturnProps => {
  const [initializing, setInitializing] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [supportedAvatarCandidates, setSupportedAvatarCandidates] = useState<
    Option[]
  >([])
  const [categoryCandidates, setCategoryCandidates] = useState<string[]>([])

  const formSchema = z.object({
    assetType: z.nativeEnum(AssetType),
    title: z.string().min(1),
    author: z.string().min(1),
    image_src: z.string().min(1),
    tags: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: AssetType.Avatar,
      title: '',
      author: '',
      image_src: '',
      tags: [],
      category: '',
      supportedAvatars: [],
    },
  })

  const submit = async () => {
    setSubmitting(true)
    try {
      console.log('submit')
    } finally {
      setSubmitting(false)
    }
  }

  const addNewCategoryCandidates = (value: string) => {
    setCategoryCandidates((prev) => [...prev, value])
  }

  const updateSupportedAvatars = async () => {
    const options: Option[] = await fetchSupportedAvatars()
    setSupportedAvatarCandidates(options)
  }

  const updateCategoryCandidates = async () => {
    const result: string[] = await fetchCategoryCandidates()
    setCategoryCandidates(result)
  }

  const initializeFields = async () => {
    try {
      const result = await fetchAssetInformation(id)

      if (!result.success) {
        // TODO: Error handling
        console.error(result.error_message!)
        return
      }

      if (result.avatar_asset !== undefined && result.avatar_asset !== null) {
        const asset = result.avatar_asset
        form.setValue('assetType', AssetType.Avatar)
        form.setValue('title', asset.description.title)
        form.setValue('author', asset.description.author)
        form.setValue('image_src', asset.description.image_src)
        form.setValue('tags', asset.description.tags)
      } else if (
        result.avatar_related_asset !== undefined &&
        result.avatar_related_asset !== null
      ) {
        const asset = result.avatar_related_asset
        form.setValue('assetType', AssetType.AvatarRelated)
        form.setValue('title', asset.description.title)
        form.setValue('author', asset.description.author)
        form.setValue('image_src', asset.description.image_src)
        form.setValue('tags', asset.description.tags)
        form.setValue('category', asset.category)
        form.setValue('supportedAvatars', asset.supported_avatars)
      } else if (
        result.world_asset !== undefined &&
        result.world_asset !== null
      ) {
        const asset = result.world_asset
        form.setValue('assetType', AssetType.World)
        form.setValue('title', asset.description.title)
        form.setValue('author', asset.description.author)
        form.setValue('image_src', asset.description.image_src)
        form.setValue('tags', asset.description.tags)
        form.setValue('category', asset.category)
      }
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    initializeFields()
    updateSupportedAvatars()
    updateCategoryCandidates()
  }, [])

  return {
    form,
    submit,
    submitting,
    supportedAvatarCandidates,
    categoryCandidates,
    addNewCategoryCandidates,
    initializing,
  }
}
