import NavBar from '@/components/page/Top/components/NavBar'
import AssetList from '../AssetList'
import AddAssetModal from '../AddAssetModal'
import { useState } from 'react'

const TopPageMainContent = () => {
  const [filterEnforced, setFilterEnforced] = useState(false)
  const [matchedAssetIDs, setMatchedAssetIDs] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const displayAssetCount: number | undefined = filterEnforced
    ? matchedAssetIDs.length
    : undefined

  return (
    <main className="w-full h-screen flex flex-col">
      <NavBar displayAssetCount={displayAssetCount} />
      <AssetList
        className="grow"
        matchedAssetIDs={matchedAssetIDs}
        setMatchedAssetIDs={setMatchedAssetIDs}
        filterEnforced={filterEnforced}
        setFilterEnforced={setFilterEnforced}
        openAddAssetDialog={() => setDialogOpen(true)}
      />
      <AddAssetModal dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </main>
  )
}

export default TopPageMainContent
