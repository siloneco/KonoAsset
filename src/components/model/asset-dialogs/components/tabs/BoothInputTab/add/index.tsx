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
import { useBoothInputTabForAddDialog } from './hook'
import { isBoothURL } from '@/lib/utils'

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
  setImageUrls: (imageUrls: string[]) => void
}

const BoothInputTabForAddDialog = ({ form, setTab, setImageUrls }: Props) => {
  const {
    representativeImportFilename,
    importFileCount,
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
    moveToNextTab,
    backToPreviousTab,
  } = useBoothInputTabForAddDialog({
    form,
    setTab,
    setImageUrls,
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>(2/4) アセット情報を取得</DialogTitle>
        <DialogDescription>
          Boothのリンクを入力すると、自動でアセット情報が入力されます！
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div className="flex justify-center">
          <p className="space-x-2">
            <span className="text-foreground/60">
              ファイルまたはフォルダ名:
            </span>
            <span>{representativeImportFilename}</span>
            {importFileCount > 1 && (
              <span className="text-foreground/60">
                と他{importFileCount - 1}アイテム
              </span>
            )}
          </p>
        </div>
        <div>
          <Label className="text-base ml-1">Boothから情報を取得する</Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder="https://booth.pm/ja/items/1234567"
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
            onClick={moveToNextTab}
          >
            自動取得をスキップ
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          className="mr-auto"
          onClick={backToPreviousTab}
        >
          戻る
        </Button>
      </DialogFooter>
    </>
  )
}

export default BoothInputTabForAddDialog
