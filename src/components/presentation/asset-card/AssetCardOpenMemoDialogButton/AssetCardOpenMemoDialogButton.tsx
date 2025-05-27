import { Button } from '@/components/ui/button'
import { NotebookText } from 'lucide-react'
import { FC } from 'react'

type Props = {
  openMemoDialog: () => Promise<void>
}

export const AssetCardOpenMemoDialogButton: FC<Props> = ({
  openMemoDialog,
}) => {
  return (
    <Button variant="outline" className="size-8" onClick={openMemoDialog}>
      <NotebookText />
    </Button>
  )
}
