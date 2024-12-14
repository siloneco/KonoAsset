import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import SelectDirectoryCard from './selector/SelectDirectoryCard'
import SelectFileCard from './selector/SelectFileCard'
import { open } from '@tauri-apps/plugin-dialog'
import { useContext } from 'react'
import { AddAssetModalContext } from '../../..'

type Props = {
  setTab: (tab: string) => void
}

const SelectorTab = ({ setTab }: Props) => {
  const { setAssetPath } = useContext(AddAssetModalContext)

  const openFileOrDirSelector = async (dir: boolean) => {
    const path = await open({ multiple: false, directory: dir })

    if (path !== null) {
      setAssetPath(path)
      setTab('booth-input')
    }
  }

  return (
    <TabsContent value="selector">
      <DialogHeader>
        <DialogTitle>(1/4) どちらを追加しますか？</DialogTitle>
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
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="mx-auto">
            キャンセル
          </Button>
        </DialogClose>
      </DialogFooter>
    </TabsContent>
  )
}

export default SelectorTab
