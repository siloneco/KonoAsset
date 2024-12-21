import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AssetType } from '@/lib/entity'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { getAssetDescriptionFromBooth } from './logic'
import { isBoothURL } from '@/lib/utils'

type Props = {
  form: UseFormReturn<
    {
      assetType: AssetType
      title: string
      author: string
      image_src: string
      booth_url: string | null
      tags: string[]
      category: string
      supportedAvatars: string[]
      published_at: number | null
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >
  disabled: boolean
}

const BoothInputs = ({ form, disabled }: Props) => {
  const [fetching, setFetching] = useState(false)

  const fetchFromBooth = async () => {
    try {
      setFetching(true)
      const url = form.getValues('booth_url')!

      if (!isBoothURL(url)) {
        return
      }

      await getAssetDescriptionFromBooth({
        url: form.getValues('booth_url')!,
        form,
      })
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="w-full my-8 mx-auto max-w-[600px]">
      <FormField
        control={form.control}
        name="booth_url"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Boothの商品URL</FormLabel>
              <div className="flex flex-row space-x-2">
                <Input
                  type="text"
                  placeholder="Boothの商品URLを入力..."
                  disabled={disabled || fetching}
                  {...form.register('booth_url')}
                  onChange={(e) => {
                    form.setValue('booth_url', e.target.value)
                  }}
                />
                <Button
                  type="button"
                  disabled={
                    disabled ||
                    fetching ||
                    !isBoothURL(form.getValues('booth_url')!)
                  }
                  onClick={fetchFromBooth}
                >
                  取得
                </Button>
              </div>
              <FormDescription>
                Boothから情報を取得したり、アセット一覧からBoothに飛ぶことができます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}

export default BoothInputs
