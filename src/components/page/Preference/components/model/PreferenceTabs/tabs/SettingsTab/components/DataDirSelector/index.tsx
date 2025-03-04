import { Label } from '@/components/ui/label'
import { FC, useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import DestinationSelectTab from './tabs/DestinationSelectTab'
import ProgressTab from './tabs/ProgressTab'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { commands } from '@/lib/bindings'
import { cn } from '@/lib/utils'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  dataDir: string
  updateLocalDataDir: (dataDir: string) => Promise<void>
}

const DataDirSelector: FC<Props> = ({ dataDir, updateLocalDataDir }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [destinationPath, setDestinationPath] = useState('')
  const [migrationEnabled, setMigrationEnabled] = useState(true)
  const [tab, setTab] = useState('destination-select-tab')
  const [taskId, setTaskId] = useState<string | null>(null)

  const { t } = useLocalization()
  const { preference } = useContext(PreferenceContext)

  const onOpenButtonClick = async () => {
    const result = await commands.openDataDir()

    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  const setDialogOpenWithDataReset = (open: boolean) => {
    if (open) {
      setDestinationPath('')
      setMigrationEnabled(true)
      setTab('destination-select-tab')
      setTaskId(null)
    }

    setDialogOpen(open)
  }

  return (
    <div className="flex flex-row items-center">
      <div className="space-y-2 flex-grow">
        <Label className="text-xl">
          {t('preference:settings:application-data')}
        </Label>
        <p className="text-muted-foreground text-sm">
          {t('preference:settings:application-data:explanation-text')}
        </p>
        <div className="flex flex-row w-4/5">
          <Input value={dataDir} className="w-full max-w-[600px]" disabled />
          <Button
            variant="outline"
            className="ml-2"
            onClick={onOpenButtonClick}
          >
            {t('general:button:open')}
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpenWithDataReset}>
        <DialogTrigger asChild>
          <Button className="ml-2" variant="secondary">
            {t('preference:settings:application-data:change')}
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            'max-w-[550px]',
            tab === 'progress' && '[&>button]:hidden',
          )}
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <Tabs value={tab} onValueChange={setTab}>
            <TabsContent value="destination-select-tab">
              <DestinationSelectTab
                currentDataDir={preference.dataDirPath}
                switchToProgressTab={(taskId) => {
                  setTaskId(taskId)
                  setTab('progress')
                }}
                destinationPath={destinationPath}
                setDestinationPath={setDestinationPath}
                migrationEnabled={migrationEnabled}
                setMigrationEnabled={setMigrationEnabled}
              />
            </TabsContent>
            <TabsContent value="progress" className="max-w-[500px]">
              <ProgressTab
                taskId={taskId}
                destinationPath={destinationPath}
                setDialogOpen={setDialogOpen}
                updateLocalDataDir={updateLocalDataDir}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataDirSelector
