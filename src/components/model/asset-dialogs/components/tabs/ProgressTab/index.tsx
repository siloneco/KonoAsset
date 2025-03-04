import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  onCompleted: () => void
  onCancelled: () => void
  onFailed: (error: string | null) => void
}

const ProgressTab = ({ taskId, onCompleted, onFailed, onCancelled }: Props) => {
  const { t } = useLocalization()

  return (
    <TaskStatusHandler
      taskId={taskId}
      title={t('addasset:progress-bar')}
      cancelButtonText={t('general:button:cancel')}
      onCompleted={async () => onCompleted()}
      onCancelled={async () => onCancelled()}
      onFailed={async (error) => onFailed(error)}
      noDialogWrap={true}
    />
  )
}

export default ProgressTab
