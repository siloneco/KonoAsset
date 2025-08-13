import { commands } from '@/lib/bindings'

type Props = {
  deleteAppData: boolean
  deleteMetadata: boolean
  deleteAssetData: boolean
}

export const executeReset = async ({
  deleteAppData,
  deleteMetadata,
  deleteAssetData,
}: Props) => {
  await commands.resetApplication({
    deleteAssetData,
    deleteMetadata,
    resetPreferences: deleteAppData,
  })
}
