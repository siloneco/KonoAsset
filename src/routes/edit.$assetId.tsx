import AvatarAssetEdit from '@/components/page/edit/AvatarAssetEdit'
import { AvatarAsset } from '@/lib/entity'
import { Await, createFileRoute, defer } from '@tanstack/react-router'

const exampleAsset: AvatarAsset = {
  id: '34d5f08d-e3e8-4634-b5b7-01d16aa87843',
  description: {
    title: 'オリジナル3Dモデル「しなの」',
    author: 'ポンデロニウム研究所',
    image_src:
      'https://booth.pximg.net/ed52788c-0b3b-4e38-9ded-1e5797daf0ef/i/6106863/07bd77df-a8ee-4244-8c4e-16cf7cb584bb_base_resized.jpg',
    tags: [],
    created_at: '2024-12-11T00:00:00Z',
  },
}

export const Route = createFileRoute('/edit/$assetId')({
  component: RouteComponent,
  loader: async () =>
    // { params }
    {
      // const id = params.assetId

      const getAsset = async () => {
        return exampleAsset
      }

      return { asset: defer(getAsset()) }
    },
})

function RouteComponent() {
  const { asset } = Route.useLoaderData()

  return (
    <Await promise={asset} fallback={<div>loading...</div>}>
      {(asset) => <AvatarAssetEdit asset={asset} />}
    </Await>
  )
}
