import EditPage from '@/components/page/Edit'
import { GetAssetResult } from '@/lib/entity'
import { createFileRoute } from '@tanstack/react-router'
import { invoke } from '@tauri-apps/api/core'

export const Route = createFileRoute('/edit/$id')({
  loader: async ({ params }) => {
    return (await invoke('get_asset', { id: params.id })) as GetAssetResult
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const getAssetResult = Route.useLoaderData()

  return <EditPage id={id} getAssetResult={getAssetResult} />
}
