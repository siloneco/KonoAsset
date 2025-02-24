import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Theme, UpdateChannel } from '@/lib/bindings'
import { FC } from 'react'

type Props = {
  theme: Theme
  setTheme: (theme: Theme) => Promise<void>
  updateChannel: UpdateChannel
  setUpdateChannel: (updateChannel: UpdateChannel) => Promise<void>
}

export const OtherPreferenceSelector: FC<Props> = ({
  theme,
  setTheme,
  updateChannel,
  setUpdateChannel,
}) => {
  return (
    <div className="w-full h-64 flex flex-col justify-center items-center">
      <h2 className="text-xl font-bold">その他の設定</h2>
      <div className="flex flex-col justify-start mt-8 space-y-8">
        <div className="w-[500px]">
          <div className="flex flex-row items-center">
            <div className="space-y-2">
              <Label className="text-xl">テーマ</Label>
              <p className="text-foreground/60 text-sm">
                アプリのテーマを設定します
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="ml-auto w-[180px]">
                <SelectValue placeholder="選択..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">システム設定を利用</SelectItem>
                <SelectItem value="light">ライト</SelectItem>
                <SelectItem value="dark">ダーク</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-[500px]">
          <div className="flex flex-row items-center">
            <div className="space-y-2">
              <Label className="text-xl">アップデートチャンネル</Label>
              <p className="text-foreground/60 text-sm">
                アップデートを受け取るチャンネルを指定します
              </p>
              <p className="text-foreground/60 text-sm">
                PreRelease版では新しい機能を素早く利用できますが、
                <br />
                バグが混入しやすくなります
              </p>
            </div>
            <Select value={updateChannel} onValueChange={setUpdateChannel}>
              <SelectTrigger className="ml-auto w-[180px]">
                <SelectValue placeholder="選択..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stable">Stable (安定版)</SelectItem>
                <SelectItem value={'PreRelease'}>
                  PreRelease (非安定版)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
