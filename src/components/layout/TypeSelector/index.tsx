import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const TypeSelector = () => {
  return (
    <RadioGroup defaultValue="all" className="space-y-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="avatar" id="r1" />
        <Label htmlFor="r1" className="text-base">
          アバター素体
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="avatar-assets" id="r2" />
        <Label htmlFor="r2" className="text-base">
          アバター関連アセット
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="world-assets" id="r3" />
        <Label htmlFor="r3" className="text-base">
          ワールド関連アセット
        </Label>
      </div>
      <div className="items-center text-center">
        <Button variant="outline" className="w-36 h-8">
          絞り込み解除
        </Button>
      </div>
    </RadioGroup>
  )
}

export default TypeSelector
