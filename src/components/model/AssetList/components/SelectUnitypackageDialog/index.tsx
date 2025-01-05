import { commands, FileInfo } from '@/lib/bindings'
import { DialogClose, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import UnitypackageSelector from './components/UnitypackageSelector'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  assetId: string | null
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
  unitypackageFiles: { [x: string]: FileInfo[] }
}

const SelectUnitypackageDialog = ({
  assetId,
  dialogOpen,
  setDialogOpen,

  unitypackageFiles,
}: Props) => {
  const openManagedDir = async () => {
    if (assetId === null) {
      console.error('Unable to open managed dir without assetId')
      return
    }

    const result = await commands.openManagedDir(assetId)

    if (result.status === 'error') {
      console.error(result.error)
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>どのファイルを利用しますか？</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4 max-w-[446px]">
            {Object.keys(unitypackageFiles)
              .sort((a, b) => a.localeCompare(b))
              .map((path) => (
                <UnitypackageSelector
                  key={path}
                  path={path}
                  files={unitypackageFiles[path]}
                  closeDialog={() => setDialogOpen(false)}
                />
              ))}
          </div>
        </ScrollArea>
        <div className="mt-8 w-fit mx-auto flex items-center">
          {/* TODO: implement */}
          {/* <Checkbox />
              <Label className="ml-2">
                次回から表示せず常に管理フォルダを開く
              </Label> */}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="mr-auto">
              閉じる
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={'secondary'} onClick={openManagedDir}>
              管理フォルダを開く
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SelectUnitypackageDialog
