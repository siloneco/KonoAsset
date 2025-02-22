import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronRight, Loader2 } from 'lucide-react'
import { AssetFormType } from '@/lib/form'
import { useBoothInputTabForEditDialog } from './hook'
import { isBoothURL } from '@/lib/utils'

type Props = {
  form: AssetFormType
  closeDialog: () => void
  goToNextTab: () => void
  setImageUrls: (imageUrls: string[]) => void

  tabIndex: number
  totalTabs: number
}

const BoothInputTabForEditDialog = ({
  form,
  closeDialog,
  goToNextTab,
  setImageUrls,
  tabIndex,
  totalTabs,
}: Props) => {
  const {
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
  } = useBoothInputTabForEditDialog({
    form,
    goToNextTab,
    setImageUrls,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) Booth情報の編集
        </DialogTitle>
        <DialogDescription>
          Boothのリンクを編集して情報を取得するか、次のタブへ移動してください
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div>
          <Label className="text-base ml-1">Boothの情報で上書きする</Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder="https://booth.pm/ja/items/1234567"
              value={boothUrlInput}
              onChange={onUrlInputChange}
              disabled={fetching}
            />
            <Button
              disabled={fetching || !isBoothURL(boothUrlInput)}
              onClick={() => getAssetDescriptionFromBooth()}
            >
              {!fetching && <ChevronRight size={16} />}
              {fetching && <Loader2 size={16} className="animate-spin" />}
              取得
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center">または</div>
        <div className="flex justify-center">
          <Button
            className="block w-48 h-12"
            variant={'outline'}
            onClick={goToNextTab}
          >
            変更しない
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" className="mr-auto" onClick={closeDialog}>
          キャンセル
        </Button>
      </DialogFooter>
    </>
  )
}

export default BoothInputTabForEditDialog
