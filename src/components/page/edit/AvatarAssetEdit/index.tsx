import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarAsset } from '@/lib/entity'

const formSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  tags: z.array(z.string()),
  image_src: z.string(),
})

type Props = {
  asset: AvatarAsset
}

const AvatarAssetEdit = ({ asset }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: asset.description.title,
      author: asset.description.author,
      tags: [],
      image_src: asset.description.image_src,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Temp. For debugging
    console.log(values)
  }

  return (
    <div className="flex justify-center w-full max-w-[900px] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex flex-row">
            <div className="w-2/5 m-8">
              <img
                src={asset.description.image_src}
                alt={asset.id}
                className="rounded-2xl"
              />
            </div>
            <div className="w-1/2 p-8 space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイトル</FormLabel>
                    <FormControl>
                      <Input placeholder="タイトルを入力" {...field} />
                    </FormControl>
                    <FormDescription>
                      商品のタイトルを入力してください。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作者</FormLabel>
                    <FormControl>
                      <Input placeholder="作者を入力" {...field} />
                    </FormControl>
                    <FormDescription>
                      商品の作者を入力してください。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button type="submit">セーブ</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AvatarAssetEdit
