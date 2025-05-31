import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Folder, FolderArchive, FolderInput, Info } from 'lucide-react'
import { useImportSection } from './hook'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'
import { useLocalization } from '@/hooks/use-localization'

export const ImportSection = () => {
  const { t } = useLocalization()
  const {
    taskId,
    startImportUsingDirectory,
    startImportUsingZipFile,
    onCompleted,
    onCancelled,
    onFailed,
  } = useImportSection()

  return (
    <div>
      <Label className="text-xl flex flex-row items-center">
        {t('preference:adapter:import')}
        <FolderInput className="text-foreground/50" />
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('preference:adapter:import:description')}
      </p>
      <div className="w-full flex justify-center my-6">
        <Alert className="w-full mx-8 max-w-[800px] border-primary">
          <Info className="h-4 w-4" />
          <AlertTitle>{t('preference:adapter:import:alert')}</AlertTitle>
          <AlertDescription>
            {t('preference:adapter:import:alert:description')}
          </AlertDescription>
        </Alert>
      </div>
      <div className="w-full flex justify-center space-x-4">
        <Button onClick={startImportUsingZipFile}>
          <FolderArchive />
          {t('preference:adapter:import:button:zip')}
        </Button>
        <Button onClick={startImportUsingDirectory}>
          <Folder />
          {t('preference:adapter:import:button:directory')}
        </Button>
      </div>
      <TaskStatusHandler
        taskId={taskId}
        title={t('preference:adapter:import:progress:title')}
        description={t('preference:adapter:import:progress:description')}
        onCompleted={onCompleted}
        onCancelled={onCancelled}
        onFailed={onFailed}
      />
    </div>
  )
}
