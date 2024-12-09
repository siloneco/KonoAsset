import NavBar from "@/components/page/top/NavBar";
import AssetListItem from "@/components/page/top/AssetListItem";
import { AssetItem, AssetType } from "@/lib/entity";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [assets, setAssets] = useState<AssetItem[]>([]);

  const updateAssets = async () => {
    let result = await invoke("get_assets", { assetType: AssetType.Avatar });
    setAssets(result as AssetItem[]);
  };

  return (
    <main className="w-full">
      <NavBar />
      <Button onClick={updateAssets} className="m-4">
        Fetch and Update
      </Button>
      <div className="grid grid-cols-2 gap-4 m-6 md:grid-cols-3 lg:grid-cols-5">
        {assets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} onDelete={() => {}} />
        ))}
      </div>
    </main>
  );
}
