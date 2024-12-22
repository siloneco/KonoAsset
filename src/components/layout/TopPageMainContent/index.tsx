import NavBar from '@/components/page/Top/components/NavBar'
import AssetList from '../../model/AssetList'

const TopPageMainContent = () => {
  return (
    <main className="w-full h-screen flex flex-col">
      <NavBar />
      <AssetList className="flex-grow" />
    </main>
  )
}

export default TopPageMainContent
