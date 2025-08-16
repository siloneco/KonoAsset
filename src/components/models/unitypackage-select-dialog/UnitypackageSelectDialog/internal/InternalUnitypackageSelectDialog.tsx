import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileInfo } from '@/lib/bindings'
import { FC } from 'react'
import { DirectoryBlock } from '../../DirectoryBlock'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { useLocalization } from '@/hooks/use-localization'
import { Label } from '@/components/ui/label'

type Props = {
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void

  unitypackageFiles: { [x: string]: FileInfo[] }

  skipDialogPreferenceEnabled: boolean
  setAndSaveSkipDialogPreference: (skipDialogPreference: boolean) => void

  openFileInFileManager: (filepath: string) => void
  openManagedDir: () => void
}

export const InternalUnitypackageSelectDialog: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  unitypackageFiles,
  skipDialogPreferenceEnabled,
  setAndSaveSkipDialogPreference,
  openFileInFileManager,
  openManagedDir,
}) => {
  const { t } = useLocalization()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('assetcard:select-unitypackage:select-file')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-4 w-full">
          <div className="grid grid-cols-1 w-full space-y-4">
            {Object.keys(unitypackageFiles)
              .sort((a, b) => a.localeCompare(b))
              .map((path) => (
                <DirectoryBlock
                  key={path}
                  path={path}
                  files={unitypackageFiles[path]}
                  openFileInFileManager={openFileInFileManager}
                />
              ))}
          </div>
        </ScrollArea>
        <div
          className="w-fit my-2 mx-auto flex items-center space-x-2 cursor-pointer"
          onClick={() =>
            setAndSaveSkipDialogPreference(!skipDialogPreferenceEnabled)
          }
        >
          <Checkbox
            checked={skipDialogPreferenceEnabled}
            className="cursor-pointer"
          />
          <Label className="cursor-pointer">
            {t('assetcard:select-unitypackage:always-open-dir')}
          </Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="mr-auto">
              {t('general:button:close')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary" onClick={openManagedDir}>
              {t('assetcard:open-button:open-dir')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
