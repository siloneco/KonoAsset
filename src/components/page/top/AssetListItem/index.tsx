import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AssetItem } from "@/lib/entity";
import { Edit, Folder } from "lucide-react";

type Props = {
  asset: AssetItem;
  onDelete: () => void;
};

const AssetListItem = ({ asset }: Props) => {
  function openEditPage() {
    document.location.href = `/edit/${asset.id}`;
  }

  return (
    <Card className="w-full bg-card m-1">
      <CardContent className="p-4">
        <img
          src={asset.image_src}
          alt={asset.title}
          className="w-full rounded-sm"
        />
        <CardTitle className="text-lg mt-2">{asset.title}</CardTitle>
        <Label className="text-sm">{asset.author}</Label>
        <div className="flex flex-row mt-2">
          <Button className="w-full mr-2">
            <Folder size={24} />
            <p>開く</p>
          </Button>
          <Button onClick={() => openEditPage()}>
            <Edit size={24} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetListItem;
