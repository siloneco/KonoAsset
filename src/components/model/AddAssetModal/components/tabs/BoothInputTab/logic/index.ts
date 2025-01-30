import { AssetSummary, commands, Result } from '@/lib/bindings'
import { AssetFormType } from '@/lib/form'

type Props = {
  boothItemId: number
  form: AssetFormType
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

export const getAndSetAssetDescriptionFromBoothToForm = async ({
  boothItemId,
  form,
}: Props): Promise<Result<ReturnProps, string>> => {
  const result = await commands.getAssetDescriptionFromBooth(boothItemId)

  if (result.status === 'error') {
    return result
  }

  const data = result.data

  const description = data.description

  form.setValue('name', description.name)
  form.setValue('creator', description.creator)
  form.setValue('imageFilename', description.imageFilename)
  form.setValue('publishedAt', description.publishedAt)
  form.setValue('boothItemId', boothItemId)
  form.setValue('assetType', data.estimatedAssetType ?? 'Avatar')

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
