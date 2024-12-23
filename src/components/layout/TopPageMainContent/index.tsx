import NavBar from '@/components/page/Top/components/NavBar'
import AssetList from '../../model/AssetList'
import AddAssetModal from '../AddAssetModal'

const TopPageMainContent = () => {
  return (
    <main className="w-full h-screen flex flex-col">
      <NavBar />
      <AssetList className="flex-grow" />
      <AddAssetModal />
    </main>
  )
}

export default TopPageMainContent
