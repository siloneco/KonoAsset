import { Button } from '@/components/ui/button'
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { getAssetDescriptionFromBooth } from './logic'
import { convertToBoothURL, extractBoothItemId } from '@/lib/utils'
import { AssetFormType } from '@/lib/form'

type Props = {
  form: AssetFormType
  disabled: boolean
}

const BoothInputs = ({ form, disabled }: Props) => {
  const boothIdValue = form.watch('booth_item_id')

  const defaultBoothUrlInputValue =
    boothIdValue === null ? '' : convertToBoothURL(boothIdValue)

  const [boothUrlInput, setBoothUrlInput] = useState(defaultBoothUrlInputValue)
  const [fetching, setFetching] = useState(false)

  const fetchFromBooth = async () => {
    try {
      setFetching(true)
      if (boothIdValue === null) {
        return
      }

      await getAssetDescriptionFromBooth({
        id: boothIdValue,
        form,
      })
    } finally {
      setFetching(false)
    }
  }

  const onInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setBoothUrlInput(url)

    const extractIdResult = extractBoothItemId(url)
    if (extractIdResult.isSuccess()) {
      form.setValue('booth_item_id', extractIdResult.value)
    } else {
      form.setValue('booth_item_id', null)
    }
  }

  return (
    <div className="w-full my-8 mx-auto max-w-[600px]">
      <FormField
        control={form.control}
        name="booth_item_id"
        render={() => {
          return (
            <FormItem>
              <FormLabel>Boothの商品URL</FormLabel>
              <div className="flex flex-row space-x-2">
                <Input
                  type="text"
                  placeholder="Boothの商品URLを入力..."
                  disabled={disabled || fetching}
                  value={boothUrlInput}
                  onChange={onInputValueChanged}
                />
                <Button
                  type="button"
                  disabled={disabled || fetching || boothIdValue === null}
                  onClick={fetchFromBooth}
                >
                  取得
                </Button>
              </div>
              <FormDescription>
                商品URLを指定すると、以下の情報を自動で埋めたり、アセット一覧からBoothに飛ぶことができます
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
