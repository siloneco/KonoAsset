import { FC } from 'react'
import { InternalUnitypackageSelectDialog } from './internal'
import { useUnitypackageSelectDialog } from './hook'

export const UnitypackageSelectDialog: FC = () => {
  const args = useUnitypackageSelectDialog()

  return <InternalUnitypackageSelectDialog {...args} />
}
