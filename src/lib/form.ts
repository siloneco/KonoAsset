import { UseFormReturn } from 'react-hook-form'
import { AssetType } from './bindings'

export type AssetFormFields = {
  assetType: AssetType
  name: string
  creator: string
  imageFilename: string | null
  boothItemId: number | null
  tags: string[]
  category: string
  supportedAvatars: string[]
  publishedAt: number | null
}

export type AssetFormType = UseFormReturn<
  AssetFormFields,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  undefined
>
