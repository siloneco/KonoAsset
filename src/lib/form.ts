import { UseFormReturn } from 'react-hook-form'
import { AssetType } from './entity'

export type AssetFormFields = {
  assetType: AssetType
  title: string
  author: string
  image_src: string | null
  booth_item_id: number | null
  tags: string[]
  category: string
  supportedAvatars: string[]
  published_at: number | null
}

export type AssetFormType = UseFormReturn<
  AssetFormFields,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  undefined
>
