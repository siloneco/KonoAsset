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

// create context
export const AddAssetModalContext = createContext<{
  form?: UseFormReturn<
    {
      title: string
      author: string
      image_src: string
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
}>({})

const AddAssetModal = () => {
  const [tab, setTab] = useState('selector')

  const formSchema = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    image_src: z.string().min(1),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      image_src: '',
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-12" onClick={() => setTab('selector')}>
          <Plus size={24} />
          アセットを追加する
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[650px]">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <AddAssetModalContext.Provider value={{ form }}>
            <SelectorTab setTab={setTab} />
            <BoothInputTab setTab={setTab} />
            <ManualInputTab setTab={setTab} />
          </AddAssetModalContext.Provider>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetModal
