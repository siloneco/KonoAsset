import { Label } from '@/components/ui/label'

import { FC } from 'react'
import { Switch } from '@/components/ui/switch'

type Props = {
  enable: boolean
  setEnable: (enable: boolean) => void
}

const UseUnitypackageSelectorToggle: FC<Props> = ({ enable, setEnable }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-lg">Unitypackageを優先して開く</Label>
        <p className="text-foreground/60 text-sm w-10/12">
          この設定が有効の場合「開く」ボタンを押したときにUnitypackageが選択された状態で開いたり、複数ある場合は利用するファイルを選ぶダイアログが表示されたりします
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

export default UseUnitypackageSelectorToggle
