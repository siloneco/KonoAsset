import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { FC, RefObject } from 'react'

type Props = {
  onSwitchModeClicked: () => void

  name: string
  setName: (name: string) => void
  creator: string
  setCreator: (creator: string) => void

  ref: RefObject<HTMLInputElement | null>
}

const AdvancedTextSearch: FC<Props> = ({
  onSwitchModeClicked,
  name,
  setName,
  creator,
  setCreator,
  ref,
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-row">
        <Label className="text-base">テキストで検索</Label>
        <div
          className="w-16 bg-primary text-primary-foreground px-4 ml-auto rounded-full text-[12px] flex items-center justify-center cursor-pointer select-none"
          onClick={onSwitchModeClicked}
        >
          詳細
        </div>
      </div>
      <div className="mt-2">
        <Label>アセット名</Label>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="アセット名を入力..."
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            ref={ref}
          />
          {name && (
            <X
              size={24}
              className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
              onClick={() => {
                setName('')
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-2">
        <Label>ショップ名</Label>
        <div className="relative w-full max-w-sm">
          <Input
            placeholder="ショップ名を入力..."
            className="mt-1"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
          {creator && (
            <X
              size={24}
              className="absolute right-1 top-1/2 -translate-y-1/2 mr-2 cursor-pointer"
              onClick={() => {
                setCreator('')
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedTextSearch
