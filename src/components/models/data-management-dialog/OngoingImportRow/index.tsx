import { Button } from '@/components/ui/button'
import { Ban, Check, Loader2 } from 'lucide-react'
import { FC } from 'react'
import { useLocalization } from '@/hooks/use-localization'
import { useOngoingImportRow } from './hook'

type Props = {
  taskId: string
  filename: string
}

export const OngoingImportRow: FC<Props> = ({ taskId, filename }) => {
  const { t } = useLocalization()
  const { status, onCancelButtonClick } = useOngoingImportRow({ taskId })

  return (
    <div className="w-full flex gap-2 items-center">
      {status === 'Running' && (
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      )}
      {(status === 'Cancelled' || status === 'Failed') && (
        <Ban size={20} className="text-red-400" />
      )}
      {status === 'Completed' && <Check size={24} className="text-green-600" />}
      <p className="w-full truncate">
        {(status === 'Cancelled' || status === 'Failed') && (
          <span className="text-muted-foreground mr-2">
            (
            {status === 'Cancelled'
              ? t('general:cancelled')
              : t('general:failed')}
            )
          </span>
        )}
        <span
          className={
            status === 'Cancelled' || status === 'Failed' ? 'line-through' : ''
          }
        >
          {filename}
        </span>
      </p>
      {status === 'Running' && (
        <Button
          variant="destructive"
          className="size-8"
          onClick={onCancelButtonClick}
        >
          <Ban />
        </Button>
      )}
    </div>
  )
}
