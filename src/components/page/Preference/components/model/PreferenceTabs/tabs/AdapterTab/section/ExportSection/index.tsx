import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FolderOutput } from 'lucide-react'
import { FC } from 'react'
import { Input } from '@/components/ui/input'
import {
  ExportTypeButton,
  ExportTypeButtonDescription,
  ExportTypeButtonTitle,
} from '../../components/ExportTypeButton'
import { useExportSection } from './hook'
import { TaskStatusHandler } from '@/components/model/TaskStatusHandler'
import { useLocalization } from '@/hooks/use-localization'

export const ExportSection: FC = () => {
  const { t } = useLocalization()

  const {
    currentExportType,
    exportButtonActivated,
    exportDestination,
    selectExportDestination,
    setExportType,
    startExport,
    taskId,
    onCompleted,
    onCancelled,
    onFailed,
  } = useExportSection()

  return (
    <div className="pb-12">
      <Label className="text-xl flex flex-row items-center">
        {t('preference:adapter:export')}
        <FolderOutput className="text-foreground/50 ml-2" />
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('preference:adapter:export:description')}
      </p>
      <div className="mt-6 w-full flex flex-col items-center">
        <div className="w-4/5 max-w-[800px] space-y-6">
          <div className="space-y-2">
            <Label className="text-base">
              {t('preference:adapter:export:select-type')}
            </Label>
            <ExportTypeButton
              active={currentExportType === 'KonoAsset'}
              onClick={() => setExportType('KonoAsset')}
            >
              <ExportTypeButtonTitle>
                {t('preference:adapter:export:type:konoasset:title')}
              </ExportTypeButtonTitle>
              <ExportTypeButtonDescription>
                {t('preference:adapter:export:type:konoasset:description')}
              </ExportTypeButtonDescription>
            </ExportTypeButton>
            <ExportTypeButton
              active={currentExportType === 'AvatarExplorer'}
              onClick={() => setExportType('AvatarExplorer')}
            >
              <ExportTypeButtonTitle>
                {t('preference:adapter:export:type:avatar-explorer:title')}
              </ExportTypeButtonTitle>
              <ExportTypeButtonDescription>
                {t(
                  'preference:adapter:export:type:avatar-explorer:description',
                )}
              </ExportTypeButtonDescription>
            </ExportTypeButton>
            <ExportTypeButton
              active={currentExportType === 'HumanReadable'}
              onClick={() => setExportType('HumanReadable')}
            >
              <ExportTypeButtonTitle>
                {t('preference:adapter:export:type:human-readable-zip:title')}
              </ExportTypeButtonTitle>
              <ExportTypeButtonDescription>
                {t(
                  'preference:adapter:export:type:human-readable-zip:description',
                )}
              </ExportTypeButtonDescription>
            </ExportTypeButton>
          </div>
          <div className="space-y-2">
            <Label className="text-base">
              {t('preference:adapter:export:select-destination')}
            </Label>
            <div className="flex flex-row">
              <Input
                className="mr-2"
                placeholder={t(
                  'preference:adapter:export:select-destination:placeholder',
                )}
                value={exportDestination ?? ''}
                disabled
              />
              <Button
                variant="secondary"
                className="h-10"
                onClick={selectExportDestination}
              >
                {t('general:button:select')}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full flex justify-center">
          <Button
            className="w-1/4"
            onClick={startExport}
            disabled={!exportButtonActivated}
          >
            {t('preference:adapter:export:button')}
          </Button>
        </div>
      </div>
      <TaskStatusHandler
        taskId={taskId}
        title={t('preference:adapter:export:progress:title')}
        description={t('preference:adapter:export:progress:description')}
        onCompleted={onCompleted}
        onCancelled={onCancelled}
        onFailed={onFailed}
      />
    </div>
  )
}
