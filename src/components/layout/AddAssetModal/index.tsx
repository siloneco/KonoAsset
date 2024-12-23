import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { createContext, useState } from 'react'
import SelectorTab from './components/tabs/SelectorTab'
import BoothInputTab from './components/tabs/BoothInputTab'
import ManualInputTab from './components/tabs/ManualInputTab'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import AssetTypeSelectorTab from './components/tabs/AssetTypeSelector'
import { AssetType } from '@/lib/entity'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { cn } from '@/lib/utils'

export const AddAssetModalContext = createContext<{
  assetPath?: string
  setAssetPath: (path: string) => void
}>({
  setAssetPath: () => {},
})

type Props = {
  className?: string
}

const AddAssetModal = ({ className }: Props) => {
  const [tab, setTab] = useState('selector')
  const [assetPath, setAssetPath] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const formSchema = z.object({
    assetType: z.nativeEnum(AssetType),
    title: z.string().min(1),
    author: z.string().min(1),
    image_src: z.string().nullable(),
    booth_item_id: z.number().nullable(),
    tags: z.array(z.string()),
    category: z.string(),
    supportedAvatars: z.array(z.string()),
    published_at: z.number().nullable(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetType: AssetType.Avatar,
      title: '',
      author: '',
      tags: [],
      category: '',
    },
  })

  const contextValue = {
    assetPath,
    setAssetPath,
  }

  const clearForm = () => {
    form.reset({
      assetType: AssetType.Avatar,
      title: '',
      author: '',
      image_src: null,
      booth_item_id: null,
      tags: [],
      category: '',
      supportedAvatars: [],
      published_at: null,
    })

    setAssetPath('')
  }

  getCurrentWindow().onDragDropEvent((event) => {
    if (event.payload.type == 'drop') {
      const filepath = event.payload.paths[0]

      setAssetPath(filepath)
      setDialogOpen(true)
      setTab('booth-input')
    }
  })

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className={cn('fixed right-24 bottom-[92px]', className)}>
          <div className="fixed w-16 h-16 rounded-full bg-background" />
          <Button
            className="fixed w-16 h-16 rounded-full [&_svg]:size-8"
            onClick={() => {
              clearForm()
              setTab('selector')
            }}
          >
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
