import { AssetFormForAdd } from '@/components/presentation/asset-form/AssetFormForAdd'
import { FC } from 'react'
import { useAssetFormForAddContainer } from './hook'

type Props = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  openEditAssetDialog: (assetId: string) => Promise<void>
  openDirEditDialog: (assetId: string) => Promise<void>
}

export const AssetFormForAddContainer: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  openEditAssetDialog,
  openDirEditDialog,
}) => {
  const {
    preference,
    assetSummaries,
    assetSubmissionData,
    openFileOrDirSelector,
    fetchBoothInformation,
    getAssetSummariesByBoothId,
    downloadImageFromUrl,
    resolveImageAbsolutePath,
    openAssetManagedDir,
    searchAssetsByText,
    getNonExistentPaths,
    submit,
    submitProgress,
  } = useAssetFormForAddContainer({ setDialogOpen })

  return (
    <AssetFormForAdd
      dialogOpen={dialogOpen}
      setDialogOpen={setDialogOpen}
      preference={preference}
      assetSummaries={assetSummaries}
      assetSubmissionData={assetSubmissionData}
      openFileOrDirSelector={openFileOrDirSelector}
      fetchBoothInformation={fetchBoothInformation}
      getAssetSummariesByBoothId={getAssetSummariesByBoothId}
      downloadImageFromUrl={downloadImageFromUrl}
      resolveImageAbsolutePath={resolveImageAbsolutePath}
      openAssetManagedDir={openAssetManagedDir}
      openEditAssetDialog={openEditAssetDialog}
      openDirEditDialog={openDirEditDialog}
      searchAssetsByText={searchAssetsByText}
      getNonExistentPaths={getNonExistentPaths}
      submit={submit}
      submitProgress={submitProgress}
    />
  )
}
