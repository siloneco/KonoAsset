import { UpdateChannel } from '@/lib/bindings'
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
  updateChannel: UpdateChannel
  setUpdateChannel: (channel: UpdateChannel) => void
}

const UpdateChannelSelector: FC<Props> = ({
  updateChannel,
  setUpdateChannel,
}) => {
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2">
        <Label className="text-xl">アップデートチャンネル</Label>
        <p className="text-foreground/60 text-sm">
          アップデートを受け取るチャンネルを指定します
          <br />
          PreReleaseチャンネルでは最新の機能が素早く得られる代わりに、バグが混入しやすくなります
        </p>
      </div>
      <Select value={updateChannel} onValueChange={setUpdateChannel}>
        <SelectTrigger className="ml-auto w-[180px]">
          <SelectValue placeholder="選択..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Stable">Stable (安定版)</SelectItem>
          <SelectItem value={'PreRelease'}>PreRelease (非安定版)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default UpdateChannelSelector
