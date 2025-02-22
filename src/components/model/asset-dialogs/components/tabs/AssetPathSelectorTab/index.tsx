import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SelectDirectoryCard from './selector/SelectDirectoryCard'
import SelectFileCard from './selector/SelectFileCard'
import { open } from '@tauri-apps/plugin-dialog'
import { downloadDir } from '@tauri-apps/api/path'
import { useContext } from 'react'
import { FolderArchive, Info } from 'lucide-react'
import { AddAssetDialogContext } from '../../../AddAssetDialog'

type Props = {
  setTab: (tab: string) => void

  tabIndex: number
  totalTabs: number
}

const AssetPathSelectorTab = ({ setTab, tabIndex, totalTabs }: Props) => {
  const { setAssetPaths } = useContext(AddAssetDialogContext)

  const openFileOrDirSelector = async (dir: boolean) => {
    const path = await open({
      multiple: true,
      defaultPath: await downloadDir(),
      directory: dir,
    })

    if (path !== null) {
      setAssetPaths(path)
      setTab('booth-input')
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) どちらを追加しますか？
        </DialogTitle>
        <DialogDescription>
          フォルダとファイルのどちらを追加するか選択してください！
        </DialogDescription>
      </DialogHeader>
      <div className="mx-auto flex justify-between w-[550px] my-4">
        <SelectFileCard
          onClick={() => {
            openFileOrDirSelector(false)
          }}
        />
        <SelectDirectoryCard
          onClick={() => {
            openFileOrDirSelector(true)
          }}
        />
      </div>
      <div className="flex flex-row justify-center text-center mt-6">
        <Info className="text-primary mr-1" />
        <p className="text-card-foreground/70">
          ウィンドウ上にファイルかフォルダをドロップしても追加できます
        </p>
      </div>
      <div className="flex flex-row justify-center text-center mt-4 mb-6">
        <FolderArchive className="text-primary mr-1" />
        <p className="text-card-foreground/70">
          ZIPファイルは自動で展開されます
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="mx-auto">
            キャンセル
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

export default AssetPathSelectorTab
