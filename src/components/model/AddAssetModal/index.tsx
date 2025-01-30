import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { createContext, useContext, useEffect, useState } from 'react'
import SelectorTab from './components/tabs/SelectorTab'
import BoothInputTab from './components/tabs/BoothInputTab'
import ManualInputTab from './components/tabs/ManualInputTab'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import AssetTypeSelectorTab from './components/tabs/AssetTypeSelector'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { cn } from '@/lib/utils'
import DuplicateWarningTab from './components/tabs/DuplicateWarningTab'
import { AssetSummary, AssetType } from '@/lib/bindings'
import ProgressTab from './components/tabs/ProgressTab'
import { useToast } from '@/hooks/use-toast'
import { AssetContext } from '@/components/context/AssetContext'

export const AddAssetModalContext = createContext<{
  assetPaths?: string[]
  setAssetPaths: (paths: string[]) => void

  duplicateWarningItems: AssetSummary[]
  setDuplicateWarningItems: (items: AssetSummary[]) => void
}>({
  setAssetPaths: () => {},

  duplicateWarningItems: [],
  setDuplicateWarningItems: () => {},
})

type Props = {
  className?: string

  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const AddAssetModal = ({ className, dialogOpen, setDialogOpen }: Props) => {
  const [tab, setTab] = useState('selector')
  const [assetPaths, setAssetPaths] = useState<string[]>([])
  const [duplicateWarningItems, setDuplicateWarningItems] = useState<
    AssetSummary[]
  >([])
  const [importTaskId, setImportTaskId] = useState<string | null>(null)
  const { toast } = useToast()

  const { refreshAssets } = useContext(AssetContext)

  const assetTypeAvatar: AssetType = 'Avatar'
  const assetTypeAvatarWearable: AssetType = 'AvatarWearable'
  const assetTypeWorldObject: AssetType = 'WorldObject'

  const formSchema = z.object({
    assetType: z.union([
      z.literal(assetTypeAvatar),
      z.literal(assetTypeAvatarWearable),
      z.literal(assetTypeWorldObject),
    ]),
    name: z.string().min(1),
    creator: z.string().min(1),
    imageFilename: z.string().nullable(),
    boothItemId: z.number().nullable(),
    tags: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    publishedAt: z.number().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: 'Avatar',
      name: '',
      creator: '',
      imageFilename: null,
      boothItemId: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    },
  })

  const contextValue = {
    assetPaths,
    setAssetPaths,
    duplicateWarningItems,
    setDuplicateWarningItems,
  }

  const clearForm = () => {
    form.reset({
      assetType: 'Avatar',
      name: '',
      creator: '',
      imageFilename: null,
      boothItemId: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    })

    setAssetPaths([])
  }

  getCurrentWindow().onDragDropEvent((event) => {
    if (event.payload.type == 'drop') {
      // 文字をドラッグアンドドロップしようとするとundefinedになる
      if (event.payload.paths.length <= 0) {
        return
      }

      setAssetPaths(event.payload.paths)
      setDialogOpen(true)
      setTab('booth-input')
    }
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        setDialogOpen(true)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!dialogOpen) {
      // 閉じるときにタブが変わってしまうのが見えるため遅延を入れる
      setTimeout(() => {
        clearForm()
        setTab('selector')
      }, 500)
    }
  }, [dialogOpen])

  const onComplete = () => {
    toast({
      title: 'アセットが追加されました！',
      description: form.getValues('name'),
      duration: 3000,
    })

    setTab('empty')
    setDialogOpen(false)
    refreshAssets()
  }

  const onCancelled = () => {
    toast({
      title: 'キャンセルされました',
      duration: 2000,
    })

    setTab('empty')
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className={cn('fixed right-24 bottom-[92px]', className)}>
          <div className="fixed w-16 h-16 rounded-full bg-background" />
          <Button className="fixed w-16 h-16 rounded-full [&_svg]:size-8">
            <Plus size={32} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-[650px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <AddAssetModalContext.Provider value={contextValue}>
            <TabsContent value="selector">
              <SelectorTab setTab={setTab} />
            </TabsContent>
            <TabsContent value="booth-input">
              <BoothInputTab form={form} setTab={setTab} />
            </TabsContent>
            <TabsContent value="duplicate-warning">
              <DuplicateWarningTab setTab={setTab} />
            </TabsContent>
            <TabsContent value="asset-type-selector">
              <AssetTypeSelectorTab form={form} setTab={setTab} />
            </TabsContent>
            <TabsContent value="manual-input">
              <ManualInputTab
                form={form}
                setTab={setTab}
                setImportTaskId={setImportTaskId}
              />
            </TabsContent>
            <TabsContent value="progress">
              <ProgressTab
                taskId={importTaskId}
                onComplete={onComplete}
                onCancelled={onCancelled}
              />
            </TabsContent>
            <TabsContent value="empty"></TabsContent>
          </AddAssetModalContext.Provider>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetModal
