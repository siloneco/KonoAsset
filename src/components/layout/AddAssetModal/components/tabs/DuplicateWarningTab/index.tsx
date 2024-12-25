import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TabsContent } from '@/components/ui/tabs'
import { useContext } from 'react'
import { AddAssetModalContext } from '../../..'
import { OctagonAlert } from 'lucide-react'
import SlimAssetDetail from './components/SlimAssetDetail'

type Props = {
  setTab: (tab: string) => void
}

const DuplicateWarningTab = ({ setTab }: Props) => {
  const { duplicateWarningItems } = useContext(AddAssetModalContext)

  const moveToPreviousTab = () => {
    setTab('booth-input')
  }

  const moveToNextTab = () => {
    setTab('asset-type-selector')
  }

  return (
    <TabsContent value="duplicate-warning">
      <DialogHeader>
        <DialogTitle>(2.5/4) 重複の確認</DialogTitle>
        <DialogDescription>
          登録済みのアセットを登録しようとしていませんか？
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div className="flex flex-col items-center">
          <p className="flex flex-row">
            <OctagonAlert className="text-destructive mr-2" />
            同じBoothのリンクが設定されたアセットが存在します！
          </p>
        </div>
      </div>
      <div>
        {duplicateWarningItems.map((item) => (
          <div key={item.id} className="mb-4">
            <SlimAssetDetail asset={item} />
          </div>
        ))}
      </div>
      <DialogFooter className="mt-8">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={moveToPreviousTab}
        >
          戻る
        </Button>
        <Button variant="secondary" className="ml-auto" onClick={moveToNextTab}>
          このまま進む
        </Button>
      </DialogFooter>
    </TabsContent>
  )
}

export default DuplicateWarningTab
