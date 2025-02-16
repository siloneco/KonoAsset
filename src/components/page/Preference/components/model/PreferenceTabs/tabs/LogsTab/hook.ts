import { commands, LogEntry } from '@/lib/bindings'
import { useEffect, useState } from 'react'

type ReturnProps = {
  logs: LogEntry[]
  reloadLogs: () => Promise<void>
  openLogsFolder: () => Promise<void>
}

export const useLogsTab = (): ReturnProps => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const reloadLogs = async () => {
    setLogs(await commands.getLogs())
  }

  useEffect(() => {
    reloadLogs()
  }, [])

  const openLogsFolder = async () => {
    await commands.openLogsDir()
  }

  return {
    logs,
    reloadLogs,
    openLogsFolder,
  }
}
