import { PersistentContext } from '@/components/context/PersistentContext'
import { Button } from '@/components/ui/button'
import { FolderSearch, Sprout } from 'lucide-react'
import { FC, useContext } from 'react'

type Props = {
  type: 'NoAssets' | 'NoResults'
  openDialog: () => void
}

const AssetListBackground: FC<Props> = ({ type, openDialog }) => {
  if (type === 'NoAssets') {
    return (
      <div className="flex flex-col w-full h-[calc(100vh-150px)] justify-center items-center">
        <Sprout size={150} className="opacity-40" />
        <p className="text-xl text-foreground/60">
          アセットが1つも登録されていません
        </p>
        <Button className="mt-4" onClick={openDialog}>
          アセットを登録する
        </Button>
      </div>
    )
  } else if (type === 'NoResults') {
    const { clearFilters } = useContext(PersistentContext)

    return (
      <div className="flex flex-col w-full h-[calc(100vh-150px)] justify-center items-center">
        <FolderSearch size={100} className="opacity-40" />
        <p className="text-xl text-foreground/60">
          フィルタ条件を満たすアセットがありません
        </p>
        <Button className="mt-4" variant="secondary" onClick={clearFilters}>
          フィルタをクリア
        </Button>
      </div>
    )
  } else {
    return null
  }
}

export default AssetListBackground
