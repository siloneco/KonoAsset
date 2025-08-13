import { commands } from '@/lib/bindings'

type DeleteAssetProps = {
  id: string
  deleteFromFrontend: (id: string) => void
  successToast: () => void
  failedToast: (error: string) => void
}

export const deleteAsset = async ({
  id,
  deleteFromFrontend,
  successToast,
  failedToast,
}: DeleteAssetProps) => {
  const result = await commands.requestAssetDeletion(id)

  if (result.status === 'ok') {
    deleteFromFrontend(id)
    successToast()
  } else {
    failedToast(result.error)
  }
}

export const fetchBoothUrl = async (id: number): Promise<string | null> => {
  const result = await commands.getBoothUrl(id)

  if (result.status === 'error') {
    console.error(`Failed to fetch BOOTH URL for item ${id}: ${result.error}`)
    return null
  }

  return result.data
}
