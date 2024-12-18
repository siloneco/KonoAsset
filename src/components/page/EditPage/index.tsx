import { Button } from '@/components/ui/button'
import { useEditPageHook } from './hook'
import { Form } from '@/components/ui/form'
import CommonInputs from './components/CommonInputs'
import { Card, CardContent } from '@/components/ui/card'
import AvatarRelatedInputs from './components/AvatarRelatedInputs'
import { AssetType } from '@/lib/entity'
import WorldInputs from './components/WorldInputs'
import { Loader2 } from 'lucide-react'

type Props = {
  id: string
}

const EditPage = ({ id }: Props) => {
  const {
    form,
    submit,
    submitting,
    supportedAvatarCandidates,
    categoryCandidates,
    addNewCategoryCandidates,
  } = useEditPageHook({ id })

  const assetType: AssetType = form.watch('assetType')

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <main className="m-auto w-full max-w-[800px]">
        <Card>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-4"
                autoComplete="off"
              >
                <CommonInputs form={form} disabled={submitting} />
                {assetType === AssetType.AvatarRelated && (
                  <AvatarRelatedInputs
                    form={form}
                    disabled={submitting}
                    supportedAvatarCandidates={supportedAvatarCandidates}
                    categoryCandidates={categoryCandidates}
                    addNewCategoryCandidates={addNewCategoryCandidates}
                  />
                )}
                {assetType === AssetType.World && (
                  <WorldInputs
                    form={form}
                    disabled={submitting}
                    categoryCandidates={categoryCandidates}
                    addNewCategoryCandidates={addNewCategoryCandidates}
                  />
                )}
                <div className="mt-8 flex justify-between">
                  <Button
                    variant={'secondary'}
                    onClick={() => (document.location.href = `/`)}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    保存
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default EditPage
