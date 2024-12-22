import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, ExternalLink, Loader2 } from 'lucide-react'
import { useContext, useState } from 'react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { cn, convertToBoothURL } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { Route } from '@/routes/edit.$id'
import { PersistentContext } from '@/components/context/PersistentContext'

type Props = {
  id: string
  boothItemID?: number
  executeAssetDeletion: () => Promise<void>
}

export const MoreButton = ({
  id,
  boothItemID,
  executeAssetDeletion,
}: Props) => {
  const [deleting, setDeleting] = useState(false)
  const [dialogOpened, setDialogOpened] = useState(false)
  const { setEditingAssetID } = useContext(PersistentContext)

  const onClick = async () => {
    setDeleting(true)
    try {
      await executeAssetDeletion()
    } finally {
      setDeleting(false)
    }

    setDialogOpened(false)
  }

  const boothUrl =
    boothItemID !== undefined ? convertToBoothURL(boothItemID) : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="my-auto w-10 h-10">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <DropdownMenuItem asChild disabled={boothUrl === undefined}>
                <a
                  href={boothUrl}
                  className="decoration-inherit text-inherit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} className="text-card-foreground/40" />
                  Boothで開く
                </a>
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent className={cn(boothUrl !== undefined && 'hidden')}>
              <p>Booth URLが設定されていません！</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuItem asChild>
          <Link
            to={Route.to}
            params={{ id }}
            className="decoration-inherit text-inherit"
            onClick={() => setEditingAssetID(id)}
          >
            編集
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="font-bold text-destructive focus:text-destructive dark:text-red-500 dark:focus:text-red-500"
              onSelect={(e) => e.preventDefault()}
            >
              削除
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                アセットを本当に削除しますか？
              </AlertDialogTitle>
              <AlertDialogDescription>
                データは完全に削除されます。この操作を取り消すことは出来ません！
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>
                キャンセル
              </AlertDialogCancel>
              <Button
                variant={'destructive'}
                disabled={deleting}
                onClick={onClick}
              >
                {deleting && <Loader2 className="animate-spin" />}
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
