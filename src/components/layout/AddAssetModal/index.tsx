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
import { useForm, UseFormReturn } from 'react-hook-form'
import AssetTypeSelectorTab from './components/tabs/AssetTypeSelector'
import { AssetType } from '@/lib/entity'
import { getCurrentWindow } from '@tauri-apps/api/window'

export const AddAssetModalContext = createContext<{
  form?: UseFormReturn<
    {
      title: string
      author: string
      image_src: string
      tags: string[]
      category: string
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  assetPath?: string
  setAssetPath: (path: string) => void
  assetType?: AssetType
  setAssetType: (type: AssetType) => void

  supportedAvatars?: string[]
  setSupportedAvatars: (avatars: string[]) => void
}>({
  setAssetPath: () => {},
  setAssetType: () => {},
  setSupportedAvatars: () => {},
})

const AddAssetModal = () => {
  const [tab, setTab] = useState('selector')
  const [assetPath, setAssetPath] = useState<string>('')
  const [assetType, setAssetType] = useState<AssetType>(AssetType.Avatar)
  const [supportedAvatars, setSupportedAvatars] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const formSchema = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    image_src: z.string().min(1),
    tags: z.array(z.string()),
    category: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      image_src: '',
      tags: [],
      category: '',
    },
  })

  const contextValue = {
    form,
    assetPath,
    setAssetPath,
    assetType,
    setAssetType,

    supportedAvatars,
    setSupportedAvatars,
  }

  const clearForm = () => {
    form.reset({
      title: '',
      author: '',
      image_src: '',
      tags: [],
      category: '',
    })

    setAssetPath('')
    setAssetType(AssetType.Avatar)
    setSupportedAvatars([])
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
        <Button
          className="w-full h-12"
          onClick={() => {
            clearForm()
            setTab('selector')
          }}
        >
          <Plus size={24} />
          アセットを追加する
        </Button>
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
            <BoothInputTab setTab={setTab} />
            <AssetTypeSelectorTab setTab={setTab} />
            <ManualInputTab setTab={setTab} setDialogOpen={setDialogOpen} />
          </AddAssetModalContext.Provider>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetModal
