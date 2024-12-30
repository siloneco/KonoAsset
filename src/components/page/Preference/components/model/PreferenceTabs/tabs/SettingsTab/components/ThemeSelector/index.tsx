import { Theme } from '@/lib/bindings'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { FC } from 'react'

type Props = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeSelector: FC<Props> = ({ theme, setTheme }) => {
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-xl">テーマ</Label>
        <p className="text-foreground/60 text-sm">アプリのテーマを設定します</p>
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
  )
}

export default ThemeSelector
