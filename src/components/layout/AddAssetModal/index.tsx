import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { createContext, useEffect, useState } from 'react'
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

export const AddAssetModalContext = createContext<{
  assetPath?: string
  setAssetPath: (path: string) => void

  duplicateWarningItems: AssetSummary[]
  setDuplicateWarningItems: (items: AssetSummary[]) => void
}>({
  setAssetPath: () => {},

  duplicateWarningItems: [],
  setDuplicateWarningItems: () => {},
})

type Props = {
  className?: string
}

const AddAssetModal = ({ className }: Props) => {
  const [tab, setTab] = useState('selector')
  const [assetPath, setAssetPath] = useState<string>('')
  const [duplicateWarningItems, setDuplicateWarningItems] = useState<
    AssetSummary[]
  >([])
  const [dialogOpen, setDialogOpen] = useState(false)

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
    imagePath: z.string().nullable(),
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
      imagePath: null,
      boothItemId: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    },
  })

  const contextValue = {
    assetPath,
    setAssetPath,
    duplicateWarningItems,
    setDuplicateWarningItems,
  }

  const clearForm = () => {
    form.reset({
      assetType: 'Avatar',
      name: '',
      creator: '',
      imagePath: null,
      boothItemId: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      publishedAt: null,
    })

    setAssetPath('')
  }

  getCurrentWindow().onDragDropEvent((event) => {
    if (event.payload.type == 'drop') {
      const filepath = event.payload.paths[0]

      // 文字をドラッグアンドドロップしようとするとundefinedになる
      if (filepath === undefined) {
        return
      }

      setAssetPath(filepath)
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
    if (dialogOpen) {
      clearForm()
      setTab('selector')
    }
  }, [dialogOpen])

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
            <SelectorTab setTab={setTab} />
            <BoothInputTab form={form} setTab={setTab} />
            <DuplicateWarningTab setTab={setTab} />
            <AssetTypeSelectorTab form={form} setTab={setTab} />
            <ManualInputTab
              form={form}
              setTab={setTab}
              setDialogOpen={setDialogOpen}
            />
          </AddAssetModalContext.Provider>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetModal
