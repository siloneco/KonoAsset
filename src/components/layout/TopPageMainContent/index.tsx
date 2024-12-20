import NavBar from '@/components/page/top/NavBar'
import AssetList from '../../model/AssetList'

const TopPageMainContent = () => {
  return (
    <main className="w-full">
      <NavBar />
      <AssetList />
    </main>
  )
}

export default TopPageMainContent
