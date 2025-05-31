import { PreferenceTabIDs } from '@/page/Preference/hook'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Folder, RefreshCcw } from 'lucide-react'
import { FC } from 'react'
import { LogTray } from './components/LogTray'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useLogsTab } from './hook'
import { useLocalization } from '@/hooks/use-localization'

type Props = {
  id: PreferenceTabIDs
}

export const LogsTab: FC<Props> = ({ id }) => {
  const { t } = useLocalization()
  const { logs, reloadLogs, openLogsFolder } = useLogsTab()

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="p-8 w-full h-full">
        <div className="space-x-4">
          <Button onClick={openLogsFolder}>
            <Folder />
            {t('preference:logs:open-logs-folder')}
          </Button>
          <Button
            variant="secondary"
            className="h-10 w-10"
            onClick={reloadLogs}
          >
            <RefreshCcw />
          </Button>
        </div>
        <Card className="mt-4 p-4 w-[calc(100vw-320px)] h-[calc(100vh-120px)] overflow-hidden">
          <div className="w-full h-full">
            <ScrollArea className="h-full w-full pr-3 pb-3">
              <div className="space-y-2 pr-10 pb-2">
                {logs.map((log, index) => (
                  <LogTray key={index} log={log} />
                ))}
              </div>
              <ScrollBar orientation="vertical" />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </Card>
      </div>
    </TabsContent>
  )
}
