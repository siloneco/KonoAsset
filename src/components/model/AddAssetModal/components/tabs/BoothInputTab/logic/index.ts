import { AssetSummary, commands, Result } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'

type Props = {
  boothItemId: number
  form: AssetFormType
  setImageUrls: (imageUrls: string[]) => void
}

type ReturnProps =
  | {
      goNext: true
      duplicated: false
    }
  | {
      goNext: false
      duplicated: true
      duplicatedItems: AssetSummary[]
    }

export const getAndSetAssetInfoFromBoothToForm = async ({
  boothItemId,
  form,
  setImageUrls,
}: Props): Promise<Result<ReturnProps, string>> => {
  const result = await commands.getAssetInfoFromBooth(boothItemId)

  if (result.status === 'error') {
    return result
  }

  const data = result.data

  form.setValue('name', data.name)
  form.setValue('creator', data.creator)
  form.setValue('publishedAt', data.publishedAt)
  form.setValue('boothItemId', boothItemId)
  form.setValue('assetType', data.estimatedAssetType ?? 'Avatar')

  setImageUrls(data.imageUrls)
  if (data.imageUrls.length > 0) {
    const imageResolveResult = await commands.resolvePximgFilename(
      data.imageUrls[0],
    )

    if (imageResolveResult.status === 'ok') {
      form.setValue('imageFilename', imageResolveResult.data)
    }
  }

  const duplicationCheckResult =
    await commands.getAssetDisplaysByBoothId(boothItemId)

  if (duplicationCheckResult.status === 'ok') {
    const duplicationCheckData = duplicationCheckResult.data

    if (duplicationCheckData.length > 0) {
      return {
        status: 'ok',
        data: {
          goNext: false,
          duplicated: true,
          duplicatedItems: duplicationCheckData,
        },
      }
    }
  }

  if (duplicationCheckResult.status === 'error') {
    return {
      status: 'error',
      error: duplicationCheckResult.error,
    }
  }

  return {
    status: 'ok',
    data: {
      goNext: true,
      duplicated: false,
    },
  }
}
