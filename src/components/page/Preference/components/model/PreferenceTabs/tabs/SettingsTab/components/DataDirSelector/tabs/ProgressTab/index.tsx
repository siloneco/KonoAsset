import { FC } from 'react'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'
import useDataDirSelectorProgressTab from './hook'

type Props = {
  taskId: string | null
  destinationPath: string
  setDialogOpen: (open: boolean) => void
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

const ProgressTab: FC<Props> = ({
  taskId,
  destinationPath,
  setDialogOpen,
  updateLocalDataDir,
}) => {
  const { onCompleted, onCancelled, onFailed } = useDataDirSelectorProgressTab({
    destinationPath,
    setDialogOpen,
    updateLocalDataDir,
  })

  return (
    <TaskStatusHandler
      taskId={taskId}
      onCompleted={onCompleted}
      onCancelled={onCancelled}
      onFailed={onFailed}
      noDialogWrap={true}
    />
  )
}

export default ProgressTab
