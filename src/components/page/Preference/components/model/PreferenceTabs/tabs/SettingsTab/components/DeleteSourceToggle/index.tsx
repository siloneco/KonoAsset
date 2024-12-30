import { Label } from '@/components/ui/label'

import { FC } from 'react'
import { Switch } from '@/components/ui/switch'

type Props = {
  enable: boolean
  setEnable: (enable: boolean) => void
}

const DeleteSourceToggle: FC<Props> = ({ enable, setEnable }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-lg">
          インポート後の削除ダイアログを表示しない
        </Label>
        <p className="text-foreground/60 text-sm w-10/12">
          この設定が有効の場合、アセットをインポートした後に元ファイル/フォルダが常に自動で削除されます
        </p>
      </div>
      <Switch
        className="ml-auto"
        checked={enable}
        onCheckedChange={setEnable}
      />
    </div>
  )
}

export default DeleteSourceToggle
