import { FC } from 'react'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'
import { useDataDirSelectorProgressTab } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  taskId: string | null
  destinationPath: string
  setDialogOpen: (open: boolean) => void
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

export const ProgressTab: FC<Props> = ({
  taskId,
  destinationPath,
  setDialogOpen,
  updateLocalDataDir,
}) => {
  const { t } = useLocalization()

  const { onCompleted, onCancelled, onFailed } = useDataDirSelectorProgressTab({
    destinationPath,
    setDialogOpen,
    updateLocalDataDir,
  })

  return (
    <TaskStatusHandler
      taskId={taskId}
      title={t('preference:settings:progress-bar:title')}
      description={t('preference:settings:progress-bar:description')}
      onCompleted={onCompleted}
      onCancelled={onCancelled}
      onFailed={onFailed}
      noDialogWrap={true}
    />
  )
}
