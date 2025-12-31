import { commands, SimplifiedDirEntry } from '@/lib/bindings'

export const listDirEntries = async (
  assetId: string,
): Promise<SimplifiedDirEntry[] | null> => {
  const fetchedEntries = await commands.listAssetDirEntry(assetId)

  if (fetchedEntries.status === 'ok') {
    const data = fetchedEntries.data
    return data
  } else {
    console.error(fetchedEntries.error)
    return null
  }
}
