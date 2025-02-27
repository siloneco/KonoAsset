import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tabs } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { FC } from 'react'

type Props = {
  children: React.ReactNode
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  tab: string
  setTab: (tab: string) => void
  hideTrigger?: boolean
  preventCloseOnOutsideClick?: boolean
}

const DialogWrapper: FC<Props> = ({
  dialogOpen,
  setDialogOpen,
  tab,
  setTab,
  children,
  hideTrigger = false,
  preventCloseOnOutsideClick = false,
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <div className="fixed right-24 bottom-[92px]">
            <div className="fixed w-16 h-16 rounded-full bg-background" />
            <Button className="fixed w-16 h-16 rounded-full [&_svg]:size-8">
              <Plus size={32} />
            </Button>
          </div>
        </DialogTrigger>
      )}
      <DialogContent
        className={cn(
          'max-w-[650px]',
          tab === 'progress' && '[&>button]:hidden',
        )}
        onInteractOutside={(event) => {
          if (preventCloseOnOutsideClick) {
            event.preventDefault()
          }
        }}
      >
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {children}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default DialogWrapper
