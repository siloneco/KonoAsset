import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const tmp_avatars = [
  'マヌカ',
  '桔梗',
  'セレスティア',
  'まめひなた',
  'キプフェル',
  'しなの',
  'カリン',
  '舞夜',
  '森羅',
  '萌',
]

const tmp_categories = ['衣装', '髪', '装飾品', 'ギミック']

const AvatarAssetNarrowing = () => {
  return (
    <div className="p-1 space-y-2">
      <div className="space-y-2">
        <Label className="text-base">対応アバター</Label>
        <div className="space-y-2">
          {tmp_avatars.map((avatar, index) => (
            <div className="items-top flex space-x-2">
              <Checkbox id="terms1" />
              <div className="grid gap-1.5 leading-none w-full">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {avatar}
                </label>
              </div>
              <div className="rounded-full bg-primary/80 px-1 text-center text-primary-foreground font-bold">
                {100 - 10 * index + Math.floor(Math.random() * 10)}
              </div>
            </div>
          ))}
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="その他..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="est">シフォン</SelectItem>
              <SelectItem value="cst">ラスク</SelectItem>
              <SelectItem value="mst">竜胆</SelectItem>
              <SelectItem value="pst">ルルネ</SelectItem>
              <SelectItem value="akst">瑞希</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-base">カテゴリ</Label>
        <div className="space-y-2">
          {tmp_categories.map((text, index) => (
            <div className="items-top flex space-x-2">
              <Checkbox id="terms1" />
              <div className="grid gap-1.5 leading-none w-full">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {text}
                </label>
              </div>
              <div className="rounded-full bg-primary/80 px-1 text-center text-primary-foreground font-bold">
                {50 - 10 * index + Math.floor(Math.random() * 10)}
              </div>
            </div>
          ))}
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="その他..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="est">シフォン</SelectItem>
              <SelectItem value="cst">ラスク</SelectItem>
              <SelectItem value="mst">竜胆</SelectItem>
              <SelectItem value="pst">ルルネ</SelectItem>
              <SelectItem value="akst">瑞希</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default AvatarAssetNarrowing
