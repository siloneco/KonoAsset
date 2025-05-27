import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLocalization } from '@/hooks/use-localization'
import { Route as PreferencePage } from '@/routes/preference'
import { Info, FolderArchive, ChevronRight, File, Folder } from 'lucide-react'
import { FC, ReactNode } from 'react'
import { useAssetFormItemSelectTab } from './hook'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'

type Props = {
  tabIndex: {
    current: number
    total: number
  }
  zipExtraction: boolean
  openFileOrDirSelector: ({
    type,
  }: {
    type: 'file' | 'directory'
  }) => Promise<string[] | null>
  setItems: (items: string[]) => void
  nextTab: () => void
  TanstackRouterLinkComponent?: FC<{ children: ReactNode; className?: string }>
}

export const AssetFormItemSelectTab: FC<Props> = ({
  tabIndex,
  zipExtraction,
  openFileOrDirSelector,
  setItems,
  nextTab,
  TanstackRouterLinkComponent,
}) => {
  const { onFileButtonClick, onDirectoryButtonClick } =
    useAssetFormItemSelectTab({
      openFileOrDirSelector,
      setItems,
      nextTab,
    })
  const { t } = useLocalization()

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          ({tabIndex.current}/{tabIndex.total}) {t('addasset:select-path')}
        </DialogTitle>
        <DialogDescription>
          {t('addasset:select-path:explanation-text')}
        </DialogDescription>
      </DialogHeader>
      <div className="mx-auto flex justify-between w-[550px]">
        <SelectCard type="file" onClick={onFileButtonClick} />
        <SelectCard type="directory" onClick={onDirectoryButtonClick} />
      </div>
      <div className="space-y-2 my-4">
        <DragDropText />
        <ZipExtractionText
          zipExtraction={zipExtraction}
          TanstackRouterLinkComponent={TanstackRouterLinkComponent}
        />
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

type SelectCardProps = {
  type: 'file' | 'directory'
  onClick: () => void
}

const SelectCard: FC<SelectCardProps> = ({ type, onClick }) => {
  const { t } = useLocalization()

  const IconComponent = type === 'file' ? File : Folder
  const buttonText =
    type === 'file' ? t('addasset:select-file') : t('addasset:select-directory')

  return (
    <Card className="w-[250px]">
      <CardContent>
        <div className="m-8 mb-2">
          <IconComponent
            size={80}
            className="block mx-auto text-muted-foreground dark:text-foreground"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto" onClick={onClick}>
          <ChevronRight size={24} />
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

const DragDropText: FC = () => {
  const { t } = useLocalization()

  return (
    <div className="flex flex-row justify-center text-center">
      <Info className="text-primary mr-1" />
      <p className="text-muted-foreground">
        {t('addasset:select-path:drop-text')}
      </p>
    </div>
  )
}

type ZipExtractionTextProps = {
  zipExtraction: boolean
  TanstackRouterLinkComponent?: FC<{ children: ReactNode; className?: string }>
}

const ZipExtractionText: FC<ZipExtractionTextProps> = ({
  zipExtraction,
  TanstackRouterLinkComponent = Link,
}) => {
  const { t } = useLocalization()

  return (
    <div className="flex flex-row justify-center text-center">
      <FolderArchive className="text-primary mr-1" />
      <p className="text-muted-foreground">
        {zipExtraction && t('addasset:select-path:zip-text:enabled')}
        {!zipExtraction && (
          <>
            {t('addasset:select-path:zip-text:disabled')}
            <span className="ml-1">(</span>
            <TanstackRouterLinkComponent
              to={PreferencePage.to}
              className="text-primary"
            >
              {t(
                'addasset:select-path:zip-text:disabled:move-to-preference-page',
              )}
            </TanstackRouterLinkComponent>
            <span>)</span>
          </>
        )}
      </p>
    </div>
  )
}
