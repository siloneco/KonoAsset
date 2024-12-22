import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Separator } from '@/components/ui/separator'
import TextInputSelect from '@/components/ui/text-input-select'
import { AssetFormType } from '@/lib/form'
import { cn } from '@/lib/utils'

type Props = {
  form: AssetFormType
  disabled: boolean
  supportedAvatarCandidates: Option[]
  categoryCandidates: Option[]
}

const AvatarRelatedInputs = ({
  form,
  disabled,
  supportedAvatarCandidates,
  categoryCandidates,
}: Props) => {
  const supportedAvatarsValue = form.watch('supportedAvatars')
  const categoryValueAsStr = form.watch('category')

  const categoryValue: Option | undefined =
    categoryValueAsStr === ''
      ? undefined
      : { label: categoryValueAsStr, value: categoryValueAsStr }

  return (
    <div className="w-full flex flex-row space-x-2">
      <div className="w-1/2">
        <FormField
          control={form.control}
          name="supportedAvatars"
          render={() => {
            return (
              <FormItem>
                <FormLabel>対応アバター</FormLabel>
                <MultipleSelector
                  options={supportedAvatarCandidates}
                  placeholder="対応アバターを選択..."
                  className={cn(
                    'bg-background max-w-[366px]',
                    disabled && 'opacity-50',
                  )}
                  hidePlaceholderWhenSelected
                  creatable
                  disabled={disabled}
                  emptyIndicator={
                    <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                      入力して作成
                    </p>
                  }
                  onChange={(value) =>
                    form.setValue(
                      'supportedAvatars',
                      value.map((v) => v.value),
                    )
                  }
                  value={supportedAvatarsValue.map((v) => ({
                    label: v,
                    value: v,
                  }))}
                />
                <FormDescription>
                  対応アバターは一覧で絞り込みに利用できます
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
      <Separator orientation="vertical" className="h-32 my-auto" />
      <div className="w-1/2">
        <FormField
          control={form.control}
          name="category"
          render={() => {
            return (
              <FormItem>
                <FormLabel>カテゴリ</FormLabel>
                <TextInputSelect
                  options={categoryCandidates}
                  placeholder="カテゴリを選択..."
                  className="bg-background max-w-[366px]"
                  disabled={disabled}
                  value={categoryValue}
                  creatable
                  emptyIndicator={
                    <p className="text-center text-lg text-foreground/70 dark:text-foreground/60">
                      入力して作成
                    </p>
                  }
                  onChange={(value) => {
                    if (value === null) {
                      form.setValue('category', '')
                    } else {
                      form.setValue('category', value?.value as string)
                    }
                  }}
                />
                <FormDescription>
                  カテゴリは1つまで選択できます (例: 衣装、髪など)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </div>
  )
}

export default AvatarRelatedInputs
