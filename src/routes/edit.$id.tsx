import EditPage from '@/components/page/Edit'
import { commands } from '@/lib/bindings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/$id')({
  loader: async ({ params }) => {
    return await commands.getAsset(params.id)
  },
  // disable cache
  gcTime: 0,
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const result = Route.useLoaderData()

  if (result.status === 'error') {
    return <div>Error: {result.error}</div>
  }

  return <EditPage id={id} getAssetResult={result.data} />
}
