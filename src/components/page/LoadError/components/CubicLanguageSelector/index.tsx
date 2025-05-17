import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageCode } from '@/lib/bindings'
import { Languages } from 'lucide-react'
import { FC } from 'react'

type Props = {
  onSelected: (
    language: Exclude<
      LanguageCode,
      {
        'user-provided': string
      }
    >,
  ) => void
}

export const CubicLanguageSelector: FC<Props> = ({ onSelected }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelected('en-US')}>
          English (US)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelected('en-GB')}>
          English (UK)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelected('ja-JP')}>
          日本語
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelected('zh-CN')}>
          简体中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
