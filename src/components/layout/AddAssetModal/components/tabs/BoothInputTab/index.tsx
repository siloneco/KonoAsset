import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { ChevronRight, Loader2 } from 'lucide-react'
import { AssetFormType } from '@/lib/form'
import { useBoothInputTab } from './hook'

const shopBoothUrlRegex = /^https:\/\/[0-9a-z-]+\.booth\.pm\/items\/[0-9]+$/
const defaultBoothUrlRegex = /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/[0-9]+$/

const isBoothUrl = (url: string) => {
  return defaultBoothUrlRegex.test(url) || shopBoothUrlRegex.test(url)
}

type Props = {
  form: AssetFormType
  setTab: (tab: string) => void
}

const BoothInputTab = ({ form, setTab }: Props) => {
  const {
    newAssetFilename,
    getAssetDescriptionFromBooth,
    onUrlInputChange,
    fetching,
    boothUrlInput,
    moveToNextTab,
    backToPreviousTab,
  } = useBoothInputTab({
    form,
    setTab,
  })

  return (
    <TabsContent value="booth-input">
      <DialogHeader>
        <DialogTitle>(2/4) アセット情報を取得</DialogTitle>
        <DialogDescription>
          Boothのリンクを入力すると、自動でアセット情報が入力されます！
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div className="flex justify-center">
          <p>
            <span className="text-foreground/60">
              ファイルまたはフォルダ名:
            </span>{' '}
            {newAssetFilename}
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
              disabled={fetching || !isBoothUrl(boothUrlInput)}
              onClick={() => getAssetDescriptionFromBooth()}
            >
              {!fetching && <ChevronRight size={16} />}
              {fetching && <Loader2 size={16} className="animate-spin" />}
              取得
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center">もしくは</div>
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
    </TabsContent>
  )
}

export default BoothInputTab
