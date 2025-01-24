import { PreferenceTabIDs } from '@/components/page/Preference/hook'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Folder, RefreshCcw } from 'lucide-react'
import { FC } from 'react'
import LogTray from './components/LogTray'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useLogsTab } from './hook'

type Props = {
  id: PreferenceTabIDs
}

const LogsTab: FC<Props> = ({ id }) => {
  const { logs, reloadLogs, openLogsFolder } = useLogsTab()

  return (
    <TabsContent value={id} className="mt-0 w-full h-screen">
      <div className="p-8 w-full h-full">
        <div className="space-x-4">
          <Button onClick={openLogsFolder}>
            <Folder />
            フォルダを開く
          </Button>
          <Button
            variant="secondary"
            className="h-10 w-10"
            onClick={reloadLogs}
          >
            <RefreshCcw />
          </Button>
        </div>
        <Card className="mt-4 p-4 w-[calc(100vw-330px)]">
          <div className="flex w-full overflow-x-auto">
            <ScrollArea className="shrink-0 min-w-full">
              <div className="pb-4 space-y-2">
                {logs.map((log, index) => (
                  <LogTray key={index} log={log} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </Card>
      </div>
    </TabsContent>
  )
}

export default LogsTab
