import { UseFormReturn } from 'react-hook-form'
import { AssetType } from './entity'

export type AssetFormType = UseFormReturn<
  {
    assetType: AssetType
    title: string
    author: string
    image_src: string | null
    booth_url: string | null
    tags: string[]
    category: string
    supportedAvatars: string[]
    published_at: number | null
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  undefined
>
