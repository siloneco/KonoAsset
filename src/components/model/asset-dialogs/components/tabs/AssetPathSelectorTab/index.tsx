import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SelectDirectoryCard from './selector/SelectDirectoryCard'
import SelectFileCard from './selector/SelectFileCard'
import { open } from '@tauri-apps/plugin-dialog'
import { downloadDir } from '@tauri-apps/api/path'
import { useContext } from 'react'
import { FolderArchive, Info } from 'lucide-react'
import { AddAssetDialogContext } from '../../../AddAssetDialog'
import { useLocalization } from '@/hooks/use-localization'
import { PreferenceContext } from '@/components/context/PreferenceContext'
import { Link } from '@tanstack/react-router'
import { Route as PreferencePage } from '@/routes/preference'

type Props = {
  setTab: (tab: string) => void

  tabIndex: number
  totalTabs: number
}

const AssetPathSelectorTab = ({ setTab, tabIndex, totalTabs }: Props) => {
  const { t } = useLocalization()
  const { setAssetPaths } = useContext(AddAssetDialogContext)
  const { preference } = useContext(PreferenceContext)

  const openFileOrDirSelector = async (dir: boolean) => {
    const path = await open({
      multiple: true,
      defaultPath: await downloadDir(),
      directory: dir,
    })

    if (path !== null) {
      setAssetPaths(path)
      setTab('booth-input')
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex}/{totalTabs}) {t('addasset:select-path')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:select-path:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mx-auto flex justify-between w-[550px] my-4">
        <SelectFileCard
          onClick={() => {
            openFileOrDirSelector(false)
          }}
        />
        <SelectDirectoryCard
          onClick={() => {
            openFileOrDirSelector(true)
          }}
        />
      </div>
      <div className="my-6 space-y-4">
        <div className="flex flex-row justify-center text-center">
          <Info className="text-primary mr-1" />
          <p className="text-muted-foreground">
            {t('addasset:select-path:drop-text')}
          </p>
        </div>
        <div className="flex flex-row justify-center text-center">
          <FolderArchive className="text-primary mr-1" />
          <p className="text-muted-foreground">
            {preference.zipExtraction &&
              t('addasset:select-path:zip-text:enabled')}
            {!preference.zipExtraction && (
              <>
                {t('addasset:select-path:zip-text:disabled')}
                <span className="ml-1">(</span>
                <Link to={PreferencePage.to} className="text-primary">
                  {t(
                    'addasset:select-path:zip-text:disabled:move-to-preference-page',
                  )}
                </Link>
                <span>)</span>
              </>
            )}
          </p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="mx-auto">
            {t('general:button:cancel')}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

export default AssetPathSelectorTab
