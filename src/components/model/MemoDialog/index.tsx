import { Button } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { commands } from '@/lib/bindings'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { FC, useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  assetId: string | null
  dialogOpen: boolean
  setDialogOpen: (dialogOpen: boolean) => void
}

const URL_REGEX = /https?:\/\/[^\s]+/g

const MemoDialog: FC<Props> = ({ assetId, dialogOpen, setDialogOpen }) => {
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchAssetInfo = async (id: string) => {
    try {
      setLoading(true)

      const result = await commands.getAsset(id)

      if (result.status === 'error') {
        console.error(result.error)
        return
      }

      if (result.data.assetType === 'Avatar') {
        const avatar = result.data.avatar!
        setName(avatar.description.name ?? '')
        setMemo(avatar.description.memo ?? '')
      } else if (result.data.assetType === 'AvatarWearable') {
        const wearable = result.data.avatarWearable!
        setName(wearable.description.name ?? '')
        setMemo(wearable.description.memo ?? '')
      } else if (result.data.assetType === 'WorldObject') {
        const world = result.data.worldObject!
        setName(world.description.name ?? '')
        setMemo(world.description.memo ?? '')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dialogOpen && assetId !== null) {
      fetchAssetInfo(assetId)
    }
  }, [assetId, dialogOpen])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メモ</DialogTitle>
          <DialogDescription className="max-w-[450px] truncate">
            {loading && <Skeleton className="w-52 h-3 rounded-full" />}
            {!loading && name}
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="w-full space-y-2">
            <Skeleton className="w-40 h-4 rounded-full" />
            <Skeleton className="w-64 h-4 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-96 h-4 rounded-full" />
          </div>
        )}
        {!loading && (
          <ScrollArea className="max-h-96 pr-4">
            <pre className="whitespace-pre-wrap text-base break-words max-w-[435px] font-sans">
              {memo.split('\n').map((line) => {
                let buffer: string[] = []

                return (
                  <p className="space-x-1">
                    {line.split(' ').map((text) => {
                      if (URL_REGEX.test(text)) {
                        const linkComponent = (
                          <a
                            key={text}
                            href={text}
                            className="text-blue-600 dark:text-blue-400 underline"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {text}
                          </a>
                        )

                        if (buffer.length <= 0) {
                          return linkComponent
                        }

                        const bufferedText = buffer.join(' ')
                        buffer = []

                        return (
                          <>
                            <span>{bufferedText}</span>
                            {linkComponent}
                          </>
                        )
                      }

                      buffer = [...buffer, text]

                      return <></>
                    })}
                    {buffer.length > 0 && <span>{buffer.join(' ')}</span>}
                  </p>
                )
              })}
            </pre>
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} className="mx-auto">
              閉じる
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MemoDialog
