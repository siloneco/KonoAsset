import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FC } from 'react'

type Props = {
  memo: string
  setMemo: (memo: string) => void
}

export const MemoInput: FC<Props> = ({ memo, setMemo }) => (
  <div className="w-full flex flex-row mb-4">
    <div className="w-full space-y-2">
      <Label>メモ</Label>
      <Textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        autoComplete="off"
        className="resize-none h-28"
        placeholder="アセットに追加するメモを入力..."
      />
      <p className="text-card-foreground/60 text-sm">
        メモは情報整理や検索に利用できます
      </p>
    </div>
  </div>
)
