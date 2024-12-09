import AvatarAssetEdit from "@/components/page/edit/AvatarAssetEdit";
import { AssetItem, AssetType } from "@/lib/entity";
import { Await, createFileRoute, defer } from "@tanstack/react-router";

const asset: AssetItem = {
  id: "496a82e5-624a-447f-bbb9-4e6534cd0f83",
  title: "オリジナル3Dモデル「しなの」",
  author: "ポンデロニウム研究所",
  types: [AssetType.Avatar],
  image_src:
    "https://booth.pximg.net/ed52788c-0b3b-4e38-9ded-1e5797daf0ef/i/6106863/07bd77df-a8ee-4244-8c4e-16cf7cb584bb_base_resized.jpg",
  category: { display_name: "アバター" },
  asset_dirs: [],
  tags: [],
  created_at: "2024-12-01T00:00:00Z",
};

export const Route = createFileRoute("/edit/$assetId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const id = params.assetId;

    const getAsset = async (_id: string) => {
      return asset;
    };

    return { asset: defer(getAsset(id)) };
  },
});

function RouteComponent() {
  const { asset } = Route.useLoaderData();

  return (
    <Await promise={asset} fallback={<div>loading...</div>}>
      {(asset) => <AvatarAssetEdit asset={asset} />}
    </Await>
  );
}
