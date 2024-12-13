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
import { useContext, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { FetchAssetDescriptionFromBoothResult } from '@/lib/entity'
import { AddAssetModalContext } from '../../..'

type Props = {
  setTab: (tab: string) => void
}

const shopBoothUrlRegex = /^https:\/\/[a-z]+\.booth\.pm\/items\/[0-9]+$/
const defaultBoothUrlRegex = /^https:\/\/booth\.pm\/[a-z-]{2,5}\/items\/[0-9]+$/

const isBoothUrl = (url: string) => {
  return defaultBoothUrlRegex.test(url) || shopBoothUrlRegex.test(url)
}

const BoothInputTab = ({ setTab }: Props) => {
  const [boothUrlInput, setBoothUrlInput] = useState('')
  const [fetching, setFetching] = useState(false)

  const { form } = useContext(AddAssetModalContext)

  const backToSelect = () => {
    setTab('selector')
  }

  const moveToManualInputTab = () => {
    setTab('manual-input')
  }

  const getAssetDescriptionFromBooth = async (url: string) => {
    if (fetching) {
      return
    }

    try {
      setFetching(true)
      const result: FetchAssetDescriptionFromBoothResult = await invoke(
        'get_asset_description_from_booth',
        { url },
      )

      if (result.success) {
        form?.setValue('title', result.asset_description!.title)
        form?.setValue('author', result.asset_description!.author)
        form?.setValue('image_src', result.asset_description!.image_src)

        console.log(result.asset_description)

        setTab('manual-input')
      } else {
        console.log(`Error: ${result.error_message}`)
      }
    } finally {
      setFetching(false)
    }
  }

  return (
    <TabsContent value="booth-input">
      <DialogHeader>
        <DialogTitle>② アセット情報を取得</DialogTitle>
        <DialogDescription>
          Boothのリンクを入力すると、自動でアセット情報が入力されます！
        </DialogDescription>
      </DialogHeader>
      <div className="my-8 space-y-6">
        <div>
          <Label className="text-base ml-1">Boothから情報を取得する</Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder="https://booth.pm/ja/items/123456"
              onChange={(e) => setBoothUrlInput(e.target.value)}
              disabled={fetching}
            />
            <Button
              disabled={fetching || !isBoothUrl(boothUrlInput)}
              onClick={() => getAssetDescriptionFromBooth(boothUrlInput)}
            >
              {!fetching && <ChevronRight size={16} />}
              {fetching && <Loader2 size={16} />}
              取得
            </Button>
          </div>
        </div>
        <div className="w-full flex justify-center">もしくは</div>
        <div className="flex justify-center">
          <Button
            className="block w-48 h-12"
            variant={'outline'}
            onClick={moveToManualInputTab}
          >
            自動取得をスキップ
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" className="mr-auto" onClick={backToSelect}>
          戻る
        </Button>
      </DialogFooter>
    </TabsContent>
  )
}

export default BoothInputTab
