import { FC } from 'react'
import { useDestinationSelectTab } from './hook'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Info, Loader2 } from 'lucide-react'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  currentDataDir: string
  switchToProgressTab: (taskId: string) => void
  destinationPath: string
  setDestinationPath: (path: string) => void
  migrationEnabled: boolean
  setMigrationEnabled: (enabled: boolean) => void
}

const DestinationSelectTab: FC<Props> = ({
  currentDataDir,
  switchToProgressTab,
  destinationPath,
  setDestinationPath,
  migrationEnabled,
  setMigrationEnabled,
}) => {
  const {
    executeButtonDisabled,
    executing,
    onOpenButtonClick,
    onSelectDestinationPathClick,
    onExecuteButtonClick,
  } = useDestinationSelectTab({
    destinationPath,
    setDestinationPath,
    migrationEnabled,
    switchToProgressTab,
  })
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {t('preference:settings:destination-select:change-data-dir')}
        </DialogTitle>
        <DialogDescription>
          {t('preference:settings:destination-select:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="mt-4">
          <Label>
            {t('preference:settings:destination-select:original-data-dir')}
          </Label>
          <div className="mt-1 flex flex-row items-center">
            <Input value={currentDataDir} disabled />
            <Button
              variant="outline"
              className="ml-2 h-10"
              onClick={onOpenButtonClick}
            >
              {t('general:button:open')}
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Label>
            {t('preference:settings:destination-select:destination-data-dir')}
          </Label>
          <div className="mt-1 flex flex-row items-center">
            <Input value={destinationPath} disabled />
            <Button
              variant="secondary"
              className="ml-2 h-10"
              onClick={onSelectDestinationPathClick}
            >
              {t('general:button:select')}
            </Button>
          </div>
        </div>
        <div className="w-full mt-8 flex flex-row items-center justify-center">
          <Checkbox
            checked={migrationEnabled}
            onCheckedChange={setMigrationEnabled}
          />
          <Label
            className="ml-2"
            onClick={() => setMigrationEnabled(!migrationEnabled)}
          >
            {t('preference:settings:destination-select:checkbox-text')}
          </Label>
        </div>
        {!migrationEnabled && (
          <div className="flex flex-row items-center justify-center mt-2 text-sm text-muted-foreground">
            <Info size={20} className="text-primary" />
            <div className="ml-1">
              <p>{t('preference:settings:destination-select:warn-text-1')}</p>
              <p>{t('preference:settings:destination-select:warn-text-2')}</p>
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" className="mr-auto" disabled={executing}>
            {t('general:button:cancel')}
          </Button>
        </DialogClose>
        <Button
          disabled={executeButtonDisabled || executing}
          onClick={onExecuteButtonClick}
        >
          {executing && <Loader2 className="animate-spin" />}
          {migrationEnabled
            ? t('preference:settings:destination-select:move')
            : t('preference:settings:destination-select:change')}
        </Button>
      </DialogFooter>
    </>
  )
}

export default DestinationSelectTab
