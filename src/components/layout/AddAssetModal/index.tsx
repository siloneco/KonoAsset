import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { useState } from 'react'
import SelectorTab from './components/tabs/SelectorTab'
import BoothInputTab from './components/tabs/BoothInputTab'
import ManualInputTab from './components/tabs/ManualInputTab'

const AddAssetModal = () => {
  const [tab, setTab] = useState('selector')

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
          <SelectorTab setTab={setTab} />
          <BoothInputTab setTab={setTab} />
          <ManualInputTab setTab={setTab} />
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddAssetModal
