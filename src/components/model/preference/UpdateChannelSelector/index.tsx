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
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  updateChannel: UpdateChannel
  setUpdateChannel: (channel: UpdateChannel) => void
}

const UpdateChannelSelector: FC<Props> = ({
  updateChannel,
  setUpdateChannel,
}) => {
  const { t } = useLocalization()
  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 mr-2">
        <Label className="text-xl">
          {t('preference:settings:update-channel')}
        </Label>
        <p className="text-muted-foreground text-sm">
          {t('preference:settings:update-channel:explanation-text-1')}
          <br />
          {t('preference:settings:update-channel:explanation-text-2')}
        </p>
      </div>
      <Select value={updateChannel} onValueChange={setUpdateChannel}>
        <SelectTrigger className="ml-auto w-[220px]">
          <SelectValue placeholder={t('general:select:placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Stable">
            <span className="break-all">
              {t('preference:settings:update-channel:stable')}
            </span>
          </SelectItem>
          <SelectItem value="PreRelease">
            <span className="break-all">
              {t('preference:settings:update-channel:pre-release')}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default UpdateChannelSelector
