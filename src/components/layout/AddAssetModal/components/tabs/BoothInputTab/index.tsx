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
import { ChangeEvent, useContext, useState } from 'react'
import { AddAssetModalContext } from '../../..'
import { sep } from '@tauri-apps/api/path'
import { AssetFormType } from '@/lib/form'
import { extractBoothItemId } from '@/lib/utils'
import { commands } from '@/lib/bindings'

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
  const [boothUrlInput, setBoothUrlInput] = useState('')
  const [boothItemId, setBoothItemId] = useState<number | null>(null)
  const [fetching, setFetching] = useState(false)

  const { assetPath, setDuplicateWarningItems } =
    useContext(AddAssetModalContext)

  const backToSelect = () => {
    setTab('selector')
  }

  const moveToNextTab = () => {
    setTab('asset-type-selector')
  }

  const moveToDuplicationWarning = () => {
    setTab('duplicate-warning')
  }

  const getAssetDescriptionFromBooth = async () => {
    if (fetching || boothItemId === null) {
      return
    }

    try {
      setFetching(true)

      const result = await commands.getAssetDescriptionFromBooth(boothItemId)

      if (result.status === 'error') {
        console.error(result.error)
        return
      }

      const data = result.data

      const description = data.description

      form.setValue('name', description.name)
      form.setValue('creator', description.creator)
      form.setValue('imagePath', description.imagePath)
      form.setValue('publishedAt', description.publishedAt)
      form.setValue('boothItemId', boothItemId)
      form.setValue('assetType', data.estimatedAssetType ?? 'Avatar')

      const duplicationCheckResult =
        await commands.getAssetDisplaysByBoothId(boothItemId)

      if (duplicationCheckResult.status === 'ok') {
        const duplicationCheckData = duplicationCheckResult.data

        if (duplicationCheckData.length > 0) {
          setDuplicateWarningItems(duplicationCheckData)
          moveToDuplicationWarning()
          return
        }
      }

      if (duplicationCheckResult.status === 'error') {
        console.error(duplicationCheckResult.error)
      }

      moveToNextTab()
    } finally {
      setFetching(false)
    }
  }

  const onInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setBoothUrlInput(url)

    const extractIdResult = extractBoothItemId(url)
    if (extractIdResult.status === 'ok') {
      setBoothItemId(extractIdResult.data)
    } else {
      setBoothItemId(null)
    }
  }

  const filename =
    assetPath !== undefined
      ? assetPath.split(sep()).pop()
      : 'ファイルが選択されていません！'

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
            {filename}
          </p>
        </div>
        <div>
          <Label className="text-base ml-1">Boothから情報を取得する</Label>
          <div className="flex flex-row items-center mt-1 space-x-2">
            <Input
              placeholder="https://booth.pm/ja/items/123456"
              onChange={onInputValueChange}
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
        <Button variant="outline" className="mr-auto" onClick={backToSelect}>
          戻る
        </Button>
      </DialogFooter>
    </TabsContent>
  )
}

export default BoothInputTab
