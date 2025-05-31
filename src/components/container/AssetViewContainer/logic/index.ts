import { commands, Result } from '@/lib/bindings'
import { convertFileSrc } from '@tauri-apps/api/core'

export const resolveImageAbsolutePath = async (
  filename: string,
): Promise<Result<string, string>> => {
  const result = await commands.getImageAbsolutePath(filename)

  if (result.status === 'error') {
    return result
  }

  return {
    status: 'ok',
    data: convertFileSrc(result.data),
  }
}
