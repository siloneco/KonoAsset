import { commands } from '@/lib/bindings'

export const checkForUpdate = async (): Promise<boolean> => {
  const result = await commands.checkForUpdate()

  if (result.status === 'error') {
    console.error(result.error)
    return false
  }

  return result.data
}

export const downloadUpdate = async (setTaskId: (taskId: string) => void) => {
  const result = await commands.downloadUpdate()

  if (result.status === 'ok') {
    setTaskId(result.data)
    return
  }

  console.error(result.error)
}

export const dismissUpdate = async () => {
  await commands.doNotNotifyUpdate()
}
